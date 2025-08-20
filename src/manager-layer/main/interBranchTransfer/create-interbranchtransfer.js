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
const { dbCreateInterbranchtransfer } = require("dbLayer");

class CreateInterBranchTransferManager extends InterBranchTransferManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createInterBranchTransfer",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "interBranchTransfer";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.bookId = this.bookId;
    jsonObj.sourceBranchId = this.sourceBranchId;
    jsonObj.destBranchId = this.destBranchId;
    jsonObj.quantity = this.quantity;
    jsonObj.requestedByUserId = this.requestedByUserId;
    jsonObj.status = this.status;
    jsonObj.transferLog = this.transferLog;
  }

  readRestParameters(request) {
    this.bookId = request.body?.bookId;
    this.sourceBranchId = request.body?.sourceBranchId;
    this.destBranchId = request.body?.destBranchId;
    this.quantity = request.body?.quantity;
    this.requestedByUserId = request.session?.userId;
    this.status = request.body?.status;
    this.transferLog = request.body?.transferLog;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.bookId = request.mcpParams.bookId;
    this.sourceBranchId = request.mcpParams.sourceBranchId;
    this.destBranchId = request.mcpParams.destBranchId;
    this.quantity = request.mcpParams.quantity;
    this.requestedByUserId = request.session.userId;
    this.status = request.mcpParams.status;
    this.transferLog = request.mcpParams.transferLog;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.bookId == null) {
      throw new BadRequestError("errMsg_bookIdisRequired");
    }

    if (this.sourceBranchId == null) {
      throw new BadRequestError("errMsg_sourceBranchIdisRequired");
    }

    if (this.destBranchId == null) {
      throw new BadRequestError("errMsg_destBranchIdisRequired");
    }

    if (this.quantity == null) {
      throw new BadRequestError("errMsg_quantityisRequired");
    }

    if (this.requestedByUserId == null) {
      throw new BadRequestError("errMsg_requestedByUserIdisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    // ID
    if (
      this.bookId &&
      !isValidObjectId(this.bookId) &&
      !isValidUUID(this.bookId)
    ) {
      throw new BadRequestError("errMsg_bookIdisNotAValidID");
    }

    // ID
    if (
      this.sourceBranchId &&
      !isValidObjectId(this.sourceBranchId) &&
      !isValidUUID(this.sourceBranchId)
    ) {
      throw new BadRequestError("errMsg_sourceBranchIdisNotAValidID");
    }

    // ID
    if (
      this.destBranchId &&
      !isValidObjectId(this.destBranchId) &&
      !isValidUUID(this.destBranchId)
    ) {
      throw new BadRequestError("errMsg_destBranchIdisNotAValidID");
    }

    // ID
    if (
      this.requestedByUserId &&
      !isValidObjectId(this.requestedByUserId) &&
      !isValidUUID(this.requestedByUserId)
    ) {
      throw new BadRequestError("errMsg_requestedByUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.interBranchTransfer?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateInterbranchtransfer function to create the interbranchtransfer and return the result to the controller
    const interbranchtransfer = await dbCreateInterbranchtransfer(this);

    return interbranchtransfer;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.interBranchTransferId = this.id;
    if (!this.interBranchTransferId) this.interBranchTransferId = newObjectId();

    const dataClause = {
      _id: this.interBranchTransferId,
      bookId: this.bookId,
      sourceBranchId: this.sourceBranchId,
      destBranchId: this.destBranchId,
      quantity: this.quantity,
      requestedByUserId: this.requestedByUserId,
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

module.exports = CreateInterBranchTransferManager;
