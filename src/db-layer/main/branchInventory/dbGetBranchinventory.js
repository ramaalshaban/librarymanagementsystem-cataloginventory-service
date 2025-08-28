const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { BranchInventory } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetBranchinventoryCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, BranchInventory);
    this.commandName = "dbGetBranchinventory";
    this.nullResult = false;
    this.objectName = "branchInventory";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (BranchInventory.getCqrsJoins) {
      await BranchInventory.getCqrsJoins(data);
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

const dbGetBranchinventory = (input) => {
  input.id = input.branchInventoryId;
  const dbGetCommand = new DbGetBranchinventoryCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetBranchinventory;
