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
const { dbCreateBranch } = require("dbLayer");

class CreateBranchManager extends BranchManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createBranch",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "branch";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.name = this.name;
    jsonObj.address = this.address;
    jsonObj.geoLocation = this.geoLocation;
    jsonObj.contactEmail = this.contactEmail;
  }

  readRestParameters(request) {
    this.name = request.body?.name;
    this.address = request.body?.address;
    this.geoLocation = request.body?.geoLocation;
    this.contactEmail = request.body?.contactEmail;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.name = request.mcpParams.name;
    this.address = request.mcpParams.address;
    this.geoLocation = request.mcpParams.geoLocation;
    this.contactEmail = request.mcpParams.contactEmail;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.name == null) {
      throw new BadRequestError("errMsg_nameisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.branch?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateBranch function to create the branch and return the result to the controller
    const branch = await dbCreateBranch(this);

    return branch;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.branchId = this.id;
    if (!this.branchId) this.branchId = newObjectId();

    const dataClause = {
      _id: this.branchId,
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

module.exports = CreateBranchManager;
