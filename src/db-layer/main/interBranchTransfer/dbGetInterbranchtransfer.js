const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { InterBranchTransfer } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetInterbranchtransferCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, InterBranchTransfer);
    this.commandName = "dbGetInterbranchtransfer";
    this.nullResult = false;
    this.objectName = "interBranchTransfer";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (InterBranchTransfer.getCqrsJoins) {
      await InterBranchTransfer.getCqrsJoins(data);
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

const dbGetInterbranchtransfer = (input) => {
  input.id = input.interBranchTransferId;
  const dbGetCommand = new DbGetInterbranchtransferCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetInterbranchtransfer;
