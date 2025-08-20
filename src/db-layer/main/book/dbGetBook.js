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

class DbGetBookCommand extends DBGetSequelizeCommand {
  constructor(input) {
    super(input, Book);
    this.commandName = "dbGetBook";
    this.nullResult = false;
    this.objectName = "book";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Book.getCqrsJoins) await Book.getCqrsJoins(data);
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

const dbGetBook = (input) => {
  input.id = input.bookId;
  const dbGetCommand = new DbGetBookCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetBook;
