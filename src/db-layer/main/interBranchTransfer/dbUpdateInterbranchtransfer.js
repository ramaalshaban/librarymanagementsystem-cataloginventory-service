const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { InterBranchTransfer } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const {
  InterBranchTransferQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getInterBranchTransferById = require("./utils/getInterBranchTransferById");

class DbUpdateInterbranchtransferCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, InterBranchTransfer, instanceMode);
    this.commandName = "dbUpdateInterbranchtransfer";
    this.nullResult = false;
    this.objectName = "interBranchTransfer";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-updated";
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
    this.queryCacheInvalidator = new InterBranchTransferQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "interBranchTransfer",
      this.session,
      this.requestId,
    );
    const dbData = await getInterBranchTransferById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateInterbranchtransfer = async (input) => {
  input.id = input.interBranchTransferId;
  const dbUpdateCommand = new DbUpdateInterbranchtransferCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateInterbranchtransfer;
