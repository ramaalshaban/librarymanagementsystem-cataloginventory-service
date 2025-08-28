const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { Book } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  getIdListOfBranchInventoryByField,
  updateBranchInventoryById,
  deleteBranchInventoryById,
} = require("../branchInventory");

const { BookQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteBookCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Book, instanceMode);
    this.commandName = "dbDeleteBook";
    this.nullResult = false;
    this.objectName = "book";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service" +
      "-dbevent-" +
      "book-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }

  async syncJoins() {
    const promises = [];
    const dataId = this.dbData.id;
    // relationTargetKey should be used instead of id
    try {
      // delete refrring objects

      // update referring objects

      // delete childs
      const idList_BranchInventory_bookId_book =
        await getIdListOfBranchInventoryByField(
          "bookId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_BranchInventory_bookId_book) {
        promises.push(deleteBranchInventoryById(itemId));
      }

      const idList_InterBranchTransfer_bookId_book =
        await getIdListOfInterBranchTransferByField(
          "bookId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_InterBranchTransfer_bookId_book) {
        promises.push(deleteInterBranchTransferById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Book on joined and parent objects:",
            dataId,
            result,
          );
          hexaLogger.insertError(
            "SyncJoinError",
            { function: "syncJoins", dataId: dataId },
            "->syncJoins",
            result,
          );
        }
      }
    } catch (err) {
      console.log(
        "Total Error when synching delete of Book on joined and parent objects:",
        dataId,
        err,
      );
      hexaLogger.insertError(
        "SyncJoinsTotalError",
        { function: "syncJoins", dataId: dataId },
        "->syncJoins",
        err,
      );
    }
  }
}

const dbDeleteBook = async (input) => {
  input.id = input.bookId;
  const dbDeleteCommand = new DbDeleteBookCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteBook;
