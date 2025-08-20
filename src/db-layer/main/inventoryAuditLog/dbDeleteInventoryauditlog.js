const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { InventoryAuditLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const {
  InventoryAuditLogQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteSequelizeCommand } = require("dbCommand");

class DbDeleteInventoryauditlogCommand extends DBSoftDeleteSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, InventoryAuditLog, instanceMode);
    this.commandName = "dbDeleteInventoryauditlog";
    this.nullResult = false;
    this.objectName = "inventoryAuditLog";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  //should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteInventoryauditlog = async (input) => {
  input.id = input.inventoryAuditLogId;
  const dbDeleteCommand = new DbDeleteInventoryauditlogCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteInventoryauditlog;
