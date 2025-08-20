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

class DbGetPurchaseorderCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, PurchaseOrder);
    this.commandName = "dbGetPurchaseorder";
    this.nullResult = false;
    this.objectName = "purchaseOrder";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (PurchaseOrder.getCqrsJoins) await PurchaseOrder.getCqrsJoins(data);
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

const dbGetPurchaseorder = (input) => {
  input.id = input.purchaseOrderId;
  const dbGetCommand = new DbGetPurchaseorderCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPurchaseorder;
