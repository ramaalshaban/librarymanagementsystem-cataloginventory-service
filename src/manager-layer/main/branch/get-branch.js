const BranchManager = require("./BranchManager");
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
const { dbGetBranch } = require("dbLayer");

class GetBranchManager extends BranchManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getBranch",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "branch";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.branchId = this.branchId;
  }

  readRestParameters(request) {
    this.branchId = request.params?.branchId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.branchId = request.mcpParams.branchId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.branchId == null) {
      throw new BadRequestError("errMsg_branchIdisRequired");
    }

    // ID
    if (
      this.branchId &&
      !isValidObjectId(this.branchId) &&
      !isValidUUID(this.branchId)
    ) {
      throw new BadRequestError("errMsg_branchIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.branch?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetBranch function to get the branch and return the result to the controller
    const branch = await dbGetBranch(this);

    return branch;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.branchId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = GetBranchManager;
