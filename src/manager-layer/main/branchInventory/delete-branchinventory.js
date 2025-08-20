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
const { dbDeleteBranchinventory } = require("dbLayer");

class DeleteBranchInventoryManager extends BranchInventoryManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteBranchInventory",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
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

  async fetchInstance() {
    const { getBranchInventoryById } = require("dbLayer");
    this.branchInventory = await getBranchInventoryById(this.branchInventoryId);
    if (!this.branchInventory) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

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
    // make an awaited call to the dbDeleteBranchinventory function to delete the branchinventory and return the result to the controller
    const branchinventory = await dbDeleteBranchinventory(this);

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

module.exports = DeleteBranchInventoryManager;
