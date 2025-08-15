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
const { dbUpdateBranch } = require("dbLayer");

class UpdateBranchManager extends BranchManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateBranch",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "branch";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.branchId = this.branchId;
    jsonObj.name = this.name;
    jsonObj.address = this.address;
    jsonObj.geoLocation = this.geoLocation;
    jsonObj.contactEmail = this.contactEmail;
  }

  readRestParameters(request) {
    this.branchId = request.params?.branchId;
    this.name = request.body?.name;
    this.address = request.body?.address;
    this.geoLocation = request.body?.geoLocation;
    this.contactEmail = request.body?.contactEmail;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.branchId = request.mcpParams.branchId;
    this.name = request.mcpParams.name;
    this.address = request.mcpParams.address;
    this.geoLocation = request.mcpParams.geoLocation;
    this.contactEmail = request.mcpParams.contactEmail;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getBranchById } = require("dbLayer");
    this.branch = await getBranchById(this.branchId);
    if (!this.branch) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

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
    // make an awaited call to the dbUpdateBranch function to update the branch and return the result to the controller
    const branch = await dbUpdateBranch(this);

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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      name: this.name,
      address: this.address
        ? typeof this.address == "string"
          ? JSON.parse(this.address)
          : this.address
        : null,
      geoLocation: this.geoLocation
        ? typeof this.geoLocation == "string"
          ? JSON.parse(this.geoLocation)
          : this.geoLocation
        : null,
      contactEmail: this.contactEmail,
    };

    return dataClause;
  }
}

module.exports = UpdateBranchManager;
