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

const { BranchInventory } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const {
  BranchInventoryQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getBranchInventoryById = require("./utils/getBranchInventoryById");

class DbCreateBranchinventoryCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateBranchinventory";
    this.objectName = "branchInventory";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new BranchInventoryQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "branchInventory",
      this.session,
      this.requestId,
    );
    const dbData = await getBranchInventoryById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let branchInventory = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        branchId: this.dataClause.branchId,
        bookId: this.dataClause.bookId,
      };

      branchInventory =
        branchInventory || (await BranchInventory.findOne(whereClause));

      if (branchInventory) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "branchId-bookId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        branchInventory =
          branchInventory ||
          (await BranchInventory.findById(this.dataClause.id));
        if (branchInventory) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await branchInventory.update(this.dataClause);
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
        "Error in checking unique index when creating BranchInventory",
        eDetail,
      );
    }

    if (!updated && !exists) {
      branchInventory = await BranchInventory.create(this.dataClause);
    }

    this.dbData = branchInventory.getData();
    this.input.branchInventory = this.dbData;
    await this.create_childs();
  }
}

const dbCreateBranchinventory = async (input) => {
  const dbCreateCommand = new DbCreateBranchinventoryCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateBranchinventory;
