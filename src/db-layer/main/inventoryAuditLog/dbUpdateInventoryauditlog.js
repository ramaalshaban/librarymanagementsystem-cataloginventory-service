const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { InventoryAuditLog } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const {
  InventoryAuditLogQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getInventoryAuditLogById = require("./utils/getInventoryAuditLogById");

class DbUpdateInventoryauditlogCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, InventoryAuditLog, instanceMode);
    this.commandName = "dbUpdateInventoryauditlog";
    this.nullResult = false;
    this.objectName = "inventoryAuditLog";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-updated";
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

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateInventoryauditlog = async (input) => {
  input.id = input.inventoryAuditLogId;
  const dbUpdateCommand = new DbUpdateInventoryauditlogCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateInventoryauditlog;
