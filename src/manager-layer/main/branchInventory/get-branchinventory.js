const BranchInventoryManager = require("./BranchInventoryManager");
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
const { dbGetBranchinventory } = require("dbLayer");

class GetBranchInventoryManager extends BranchInventoryManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getBranchInventory",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "branchInventory";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.branchInventoryId = this.branchInventoryId;
  }

  readRestParameters(request) {
    this.branchInventoryId = request.params?.branchInventoryId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.branchInventoryId = request.mcpParams.branchInventoryId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.branchInventoryId == null) {
      throw new BadRequestError("errMsg_branchInventoryIdisRequired");
    }

    // ID
    if (
      this.branchInventoryId &&
      !isValidObjectId(this.branchInventoryId) &&
      !isValidUUID(this.branchInventoryId)
    ) {
      throw new BadRequestError("errMsg_branchInventoryIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.branchInventory?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetBranchinventory function to get the branchinventory and return the result to the controller
    const branchinventory = await dbGetBranchinventory(this);

    return branchinventory;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.branchInventoryId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = GetBranchInventoryManager;
