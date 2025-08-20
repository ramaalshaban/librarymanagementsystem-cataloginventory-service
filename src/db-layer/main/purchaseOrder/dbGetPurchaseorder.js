const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { PurchaseOrder } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetPurchaseorderCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, PurchaseOrder);
    this.commandName = "dbGetPurchaseorder";
    this.nullResult = false;
    this.objectName = "purchaseOrder";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (PurchaseOrder.getCqrsJoins) {
      await PurchaseOrder.getCqrsJoins(data);
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

const dbGetPurchaseorder = (input) => {
  input.id = input.purchaseOrderId;
  const dbGetCommand = new DbGetPurchaseorderCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPurchaseorder;
