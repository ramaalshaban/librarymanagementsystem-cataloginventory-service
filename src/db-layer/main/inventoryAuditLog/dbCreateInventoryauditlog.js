// exsik olan :
//if exits update and if not exits create
//if index.onDuplicate == "throwError" throw error
//

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { InventoryAuditLog } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const {
  InventoryAuditLogQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getInventoryAuditLogById = require("./utils/getInventoryAuditLogById");

class DbCreateInventoryauditlogCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateInventoryauditlog";
    this.objectName = "inventoryAuditLog";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new InventoryAuditLogQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "inventoryAuditLog",
      this.session,
      this.requestId,
    );
    const dbData = await getInventoryAuditLogById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let inventoryAuditLog = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        branchId: this.dataClause.branchId,
        branchInventoryId: this.dataClause.branchInventoryId,
      };

      inventoryAuditLog =
        inventoryAuditLog || (await InventoryAuditLog.findOne(whereClause));

      if (inventoryAuditLog) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "branchId-branchInventoryId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        inventoryAuditLog =
          inventoryAuditLog ||
          (await InventoryAuditLog.findById(this.dataClause.id));
        if (inventoryAuditLog) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await inventoryAuditLog.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating InventoryAuditLog",
        eDetail,
      );
    }

    if (!updated && !exists) {
      inventoryAuditLog = await InventoryAuditLog.create(this.dataClause);
    }

    this.dbData = inventoryAuditLog.getData();
    this.input.inventoryAuditLog = this.dbData;
    await this.create_childs();
  }
}

const dbCreateInventoryauditlog = async (input) => {
  const dbCreateCommand = new DbCreateInventoryauditlogCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateInventoryauditlog;
