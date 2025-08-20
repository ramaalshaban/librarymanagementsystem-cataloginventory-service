const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { PurchaseOrder } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { PurchaseOrderQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPurchaseOrderById = require("./utils/getPurchaseOrderById");

class DbCreatePurchaseorderCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreatePurchaseorder";
    this.objectName = "purchaseOrder";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-purchaseorder-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new PurchaseOrderQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "purchaseOrder",
      this.session,
      this.requestId,
    );
    const dbData = await getPurchaseOrderById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let purchaseOrder = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        branchId: this.dataClause.branchId,
        status: this.dataClause.status,
      };

      purchaseOrder =
        purchaseOrder || (await PurchaseOrder.findOne({ where: whereClause }));

      if (purchaseOrder) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "branchId-status",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        purchaseOrder =
          purchaseOrder || (await PurchaseOrder.findByPk(this.dataClause.id));
        if (purchaseOrder) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await purchaseOrder.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating PurchaseOrder",
        eDetail,
      );
    }

    if (!updated && !exists) {
      purchaseOrder = await PurchaseOrder.create(this.dataClause);
    }

    this.dbData = purchaseOrder.getData();
    this.input.purchaseOrder = this.dbData;
    await this.create_childs();
  }
}

const dbCreatePurchaseorder = async (input) => {
  const dbCreateCommand = new DbCreatePurchaseorderCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreatePurchaseorder;
