// exsik olan :
//if exits update and if not exits create
//if index.onDuplicate == "throwError" throw error
//

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Book } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { BookQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getBookById = require("./utils/getBookById");

class DbCreateBookCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateBook";
    this.objectName = "book";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-book-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let book = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        title: this.dataClause.title,
      };

      book = book || (await Book.findOne(whereClause));

      if (book) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "title",
        );
      }
      whereClause = {
        isbn: this.dataClause.isbn,
      };

      book = book || (await Book.findOne(whereClause));

      if (book) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "isbn",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        book = book || (await Book.findById(this.dataClause.id));
        if (book) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await book.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating Book",
        eDetail,
      );
    }

    if (!updated && !exists) {
      book = await Book.create(this.dataClause);
    }

    this.dbData = book.getData();
    this.input.book = this.dbData;
    await this.create_childs();
  }
}

const dbCreateBook = async (input) => {
  const dbCreateCommand = new DbCreateBookCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateBook;
