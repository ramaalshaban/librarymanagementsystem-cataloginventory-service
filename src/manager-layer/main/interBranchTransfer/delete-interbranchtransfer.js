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
const { dbDeleteInterbranchtransfer } = require("dbLayer");

class DeleteInterBranchTransferManager extends InterBranchTransferManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteInterBranchTransfer",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "interBranchTransfer";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.interBranchTransferId = this.interBranchTransferId;
  }

  readRestParameters(request) {
    this.interBranchTransferId = request.params?.interBranchTransferId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.interBranchTransferId = request.mcpParams.interBranchTransferId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getInterBranchTransferById } = require("dbLayer");
    this.interBranchTransfer = await getInterBranchTransferById(
      this.interBranchTransferId,
    );
    if (!this.interBranchTransfer) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.interBranchTransferId == null) {
      throw new BadRequestError("errMsg_interBranchTransferIdisRequired");
    }

    // ID
    if (
      this.interBranchTransferId &&
      !isValidObjectId(this.interBranchTransferId) &&
      !isValidUUID(this.interBranchTransferId)
    ) {
      throw new BadRequestError("errMsg_interBranchTransferIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.interBranchTransfer?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteInterbranchtransfer function to delete the interbranchtransfer and return the result to the controller
    const interbranchtransfer = await dbDeleteInterbranchtransfer(this);

    return interbranchtransfer;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.interBranchTransferId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = DeleteInterBranchTransferManager;
