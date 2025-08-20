const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { InventoryAuditLog } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetInventoryauditlogCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, InventoryAuditLog);
    this.commandName = "dbGetInventoryauditlog";
    this.nullResult = false;
    this.objectName = "inventoryAuditLog";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (InventoryAuditLog.getCqrsJoins) {
      await InventoryAuditLog.getCqrsJoins(data);
    }
  }

  // populateQuery(query) {
  //  if (!this.input.getJoins) return query;
  //
  //  return query;
  //}

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbGetInventoryauditlog = (input) => {
  input.id = input.inventoryAuditLogId;
  const dbGetCommand = new DbGetInventoryauditlogCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetInventoryauditlog;
