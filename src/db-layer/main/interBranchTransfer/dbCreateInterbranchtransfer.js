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

const { InterBranchTransfer } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const {
  InterBranchTransferQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getInterBranchTransferById = require("./utils/getInterBranchTransferById");

class DbCreateInterbranchtransferCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateInterbranchtransfer";
    this.objectName = "interBranchTransfer";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let interBranchTransfer = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        sourceBranchId: this.dataClause.sourceBranchId,
        destBranchId: this.dataClause.destBranchId,
        bookId: this.dataClause.bookId,
      };

      interBranchTransfer =
        interBranchTransfer || (await InterBranchTransfer.findOne(whereClause));

      if (interBranchTransfer) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" +
            "sourceBranchId-destBranchId-bookId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        interBranchTransfer =
          interBranchTransfer ||
          (await InterBranchTransfer.findById(this.dataClause.id));
        if (interBranchTransfer) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await interBranchTransfer.update(this.dataClause);
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
        "Error in checking unique index when creating InterBranchTransfer",
        eDetail,
      );
    }

    if (!updated && !exists) {
      interBranchTransfer = await InterBranchTransfer.create(this.dataClause);
    }

    this.dbData = interBranchTransfer.getData();
    this.input.interBranchTransfer = this.dbData;
    await this.create_childs();
  }
}

const dbCreateInterbranchtransfer = async (input) => {
  const dbCreateCommand = new DbCreateInterbranchtransferCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateInterbranchtransfer;
