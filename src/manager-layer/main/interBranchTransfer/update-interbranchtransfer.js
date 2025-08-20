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
const { dbUpdateInterbranchtransfer } = require("dbLayer");

class UpdateInterBranchTransferManager extends InterBranchTransferManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateInterBranchTransfer",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "interBranchTransfer";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.interBranchTransferId = this.interBranchTransferId;
    jsonObj.status = this.status;
    jsonObj.transferLog = this.transferLog;
  }

  readRestParameters(request) {
    this.interBranchTransferId = request.params?.interBranchTransferId;
    this.status = request.body?.status;
    this.transferLog = request.body?.transferLog;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.interBranchTransferId = request.mcpParams.interBranchTransferId;
    this.status = request.mcpParams.status;
    this.transferLog = request.mcpParams.transferLog;
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
    // make an awaited call to the dbUpdateInterbranchtransfer function to update the interbranchtransfer and return the result to the controller
    const interbranchtransfer = await dbUpdateInterbranchtransfer(this);

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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      status: this.status,
      transferLog: this.transferLog
        ? typeof this.transferLog == "string"
          ? JSON.parse(this.transferLog)
          : this.transferLog
        : null,
    };

    return dataClause;
  }
}

module.exports = UpdateInterBranchTransferManager;
