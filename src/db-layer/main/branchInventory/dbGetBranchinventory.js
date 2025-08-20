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

class DbGetBranchinventoryCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, BranchInventory);
    this.commandName = "dbGetBranchinventory";
    this.nullResult = false;
    this.objectName = "branchInventory";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (BranchInventory.getCqrsJoins) await BranchInventory.getCqrsJoins(data);
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

const dbGetBranchinventory = (input) => {
  input.id = input.branchInventoryId;
  const dbGetCommand = new DbGetBranchinventoryCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetBranchinventory;
