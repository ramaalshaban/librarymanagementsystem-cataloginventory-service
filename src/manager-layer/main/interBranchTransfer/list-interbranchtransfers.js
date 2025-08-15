const InterBranchTransferManager = require("./InterBranchTransferManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbListInterbranchtransfers } = require("dbLayer");

class ListInterBranchTransfersManager extends InterBranchTransferManager {
  constructor(request, controllerType) {
    super(request, {
      name: "listInterBranchTransfers",
      controllerType: controllerType,
      pagination: true,
      defaultPageRowCount: 100,
      crudType: "getList",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "interBranchTransfers";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }

  readRestParameters(request) {
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {}

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.interBranchTransfers?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbListInterbranchtransfers function to getList the interbranchtransfers and return the result to the controller
    const interbranchtransfers = await dbListInterbranchtransfers(this);

    return interbranchtransfers;
  }

  async getRouteQuery() {
    return { $and: [{ isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = ListInterBranchTransfersManager;
