const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { PurchaseOrder } = require("models");
const { ObjectId } = require("mongoose").Types;

const { PurchaseOrderQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeletePurchaseorderCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, PurchaseOrder, instanceMode);
    this.commandName = "dbDeletePurchaseorder";
    this.nullResult = false;
    this.objectName = "purchaseOrder";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service" +
      "-dbevent-" +
      "purchaseorder-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeletePurchaseorder = async (input) => {
  input.id = input.purchaseOrderId;
  const dbDeleteCommand = new DbDeletePurchaseorderCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeletePurchaseorder;
