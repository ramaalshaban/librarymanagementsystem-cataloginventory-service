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

class DbGetInterbranchtransferCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, InterBranchTransfer);
    this.commandName = "dbGetInterbranchtransfer";
    this.nullResult = false;
    this.objectName = "interBranchTransfer";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (InterBranchTransfer.getCqrsJoins)
      await InterBranchTransfer.getCqrsJoins(data);
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

const dbGetInterbranchtransfer = (input) => {
  input.id = input.interBranchTransferId;
  const dbGetCommand = new DbGetInterbranchtransferCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetInterbranchtransfer;
