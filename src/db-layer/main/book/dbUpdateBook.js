const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Book } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { BookQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getBookById = require("./utils/getBookById");

class DbUpdateBookCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Book, instanceMode);
    this.commandName = "dbUpdateBook";
    this.nullResult = false;
    this.objectName = "book";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-book-updated";
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
    this.queryCacheInvalidator = new BookQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "book",
      this.session,
      this.requestId,
    );
    const dbData = await getBookById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateBook = async (input) => {
  input.id = input.bookId;
  const dbUpdateCommand = new DbUpdateBookCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateBook;
