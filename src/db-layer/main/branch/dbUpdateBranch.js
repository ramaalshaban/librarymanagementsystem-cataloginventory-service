const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Branch } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { BranchQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getBranchById = require("./utils/getBranchById");

class DbUpdateBranchCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Branch, instanceMode);
    this.commandName = "dbUpdateBranch";
    this.nullResult = false;
    this.objectName = "branch";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-branch-updated";
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
    this.queryCacheInvalidator = new BranchQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "branch",
      this.session,
      this.requestId,
    );
    const dbData = await getBranchById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateBranch = async (input) => {
  input.id = input.branchId;
  const dbUpdateCommand = new DbUpdateBranchCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateBranch;
