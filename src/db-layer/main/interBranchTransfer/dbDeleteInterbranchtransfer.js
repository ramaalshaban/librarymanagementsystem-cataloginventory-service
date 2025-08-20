const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { InterBranchTransfer } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  InterBranchTransferQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteInterbranchtransferCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, InterBranchTransfer, instanceMode);
    this.commandName = "dbDeleteInterbranchtransfer";
    this.nullResult = false;
    this.objectName = "interBranchTransfer";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service" +
      "-dbevent-" +
      "interbranchtransfer-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteInterbranchtransfer = async (input) => {
  input.id = input.interBranchTransferId;
  const dbDeleteCommand = new DbDeleteInterbranchtransferCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteInterbranchtransfer;
