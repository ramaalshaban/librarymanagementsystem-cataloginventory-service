const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { BranchInventory } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const {
  BranchInventoryQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getBranchInventoryById = require("./utils/getBranchInventoryById");

class DbUpdateBranchinventoryCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, BranchInventory, instanceMode);
    this.commandName = "dbUpdateBranchinventory";
    this.nullResult = false;
    this.objectName = "branchInventory";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-updated";
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

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateBranchinventory = async (input) => {
  input.id = input.branchInventoryId;
  const dbUpdateCommand = new DbUpdateBranchinventoryCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateBranchinventory;
