const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Book } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetBookCommand extends DBGetMongooseCommand {
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
    if (Book.getCqrsJoins) {
      await Book.getCqrsJoins(data);
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

const dbGetBook = (input) => {
  input.id = input.bookId;
  const dbGetCommand = new DbGetBookCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetBook;
