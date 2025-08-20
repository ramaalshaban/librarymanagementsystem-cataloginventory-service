const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PurchaseOrder } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { PurchaseOrderQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getPurchaseOrderById = require("./utils/getPurchaseOrderById");

class DbUpdatePurchaseorderCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, PurchaseOrder, instanceMode);
    this.commandName = "dbUpdatePurchaseorder";
    this.nullResult = false;
    this.objectName = "purchaseOrder";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-purchaseorder-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdatePurchaseorder = async (input) => {
  input.id = input.purchaseOrderId;
  const dbUpdateCommand = new DbUpdatePurchaseorderCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdatePurchaseorder;
