const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Branch } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const { DBCreateSequelizeCommand } = require("dbCommand");

const { BranchQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getBranchById = require("./utils/getBranchById");

class DbCreateBranchCommand extends DBCreateSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateBranch";
    this.objectName = "branch";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service-dbevent-branch-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  // should i add hooksDbLayer here?

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let branch = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        name: this.dataClause.name,
      };

      branch = branch || (await Branch.findOne({ where: whereClause }));

      if (branch) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "name",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        branch = branch || (await Branch.findByPk(this.dataClause.id));
        if (branch) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await branch.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        whereClause: this.normalizeSequalizeOps(whereClause),
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating Branch",
        eDetail,
      );
    }

    if (!updated && !exists) {
      branch = await Branch.create(this.dataClause);
    }

    this.dbData = branch.getData();
    this.input.branch = this.dbData;
    await this.create_childs();
  }
}

const dbCreateBranch = async (input) => {
  const dbCreateCommand = new DbCreateBranchCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateBranch;
