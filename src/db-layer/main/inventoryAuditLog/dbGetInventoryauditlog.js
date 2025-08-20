const { sequelize } = require("common");
const { Op } = require("sequelize");
const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");

const {
  Book,
  Branch,
  BranchInventory,
  InventoryAuditLog,
  InterBranchTransfer,
  PurchaseOrder,
  CatalogInventoryShareToken,
} = require("models");

const { DBGetSequelizeCommand } = require("dbCommand");

class DbGetInventoryauditlogCommand extends DBGetSequelizeCommand {
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
    if (InventoryAuditLog.getCqrsJoins)
      await InventoryAuditLog.getCqrsJoins(data);
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  async transposeResult() {
    // transpose dbData
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbGetInventoryauditlog = (input) => {
  input.id = input.inventoryAuditLogId;
  const dbGetCommand = new DbGetInventoryauditlogCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetInventoryauditlog;
