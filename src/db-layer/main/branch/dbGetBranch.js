const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Branch } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetBranchCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, Branch);
    this.commandName = "dbGetBranch";
    this.nullResult = false;
    this.objectName = "branch";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Branch.getCqrsJoins) {
      await Branch.getCqrsJoins(data);
    }
  }

  // populateQuery(query) {
  //  if (!this.input.getJoins) return query;
  //
  //  return query;
  //}

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbGetBranch = (input) => {
  input.id = input.branchId;
  const dbGetCommand = new DbGetBranchCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetBranch;
