const PurchaseOrderManager = require("./PurchaseOrderManager");
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
const { dbCreatePurchaseorder } = require("dbLayer");

class CreatePurchaseOrderManager extends PurchaseOrderManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createPurchaseOrder",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "purchaseOrder";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.branchId = this.branchId;
    jsonObj.requestedByUserId = this.requestedByUserId;
    jsonObj.itemRequests = this.itemRequests;
    jsonObj.status = this.status;
    jsonObj.approvalNotes = this.approvalNotes;
  }

  readRestParameters(request) {
    this.branchId = request.body?.branchId;
    this.requestedByUserId = request.session?.userId;
    this.itemRequests = request.body?.itemRequests;
    this.status = request.body?.status;
    this.approvalNotes = request.body?.approvalNotes;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.branchId = request.mcpParams.branchId;
    this.requestedByUserId = request.session.userId;
    this.itemRequests = request.mcpParams.itemRequests;
    this.status = request.mcpParams.status;
    this.approvalNotes = request.mcpParams.approvalNotes;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.branchId == null) {
      throw new BadRequestError("errMsg_branchIdisRequired");
    }

    if (this.requestedByUserId == null) {
      throw new BadRequestError("errMsg_requestedByUserIdisRequired");
    }

    if (this.itemRequests == null) {
      throw new BadRequestError("errMsg_itemRequestsisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    // ID
    if (
      this.branchId &&
      !isValidObjectId(this.branchId) &&
      !isValidUUID(this.branchId)
    ) {
      throw new BadRequestError("errMsg_branchIdisNotAValidID");
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

    this.isOwner = this.purchaseOrder?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreatePurchaseorder function to create the purchaseorder and return the result to the controller
    const purchaseorder = await dbCreatePurchaseorder(this);

    return purchaseorder;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.purchaseOrderId = this.id;
    if (!this.purchaseOrderId) this.purchaseOrderId = newObjectId();

    const dataClause = {
      _id: this.purchaseOrderId,
      branchId: this.branchId,
      requestedByUserId: this.requestedByUserId,
      itemRequests: this.itemRequests
        ? typeof this.itemRequests == "string"
          ? JSON.parse(this.itemRequests)
          : this.itemRequests
        : null,
      status: this.status,
      approvalNotes: this.approvalNotes,
    };

    return dataClause;
  }
}

module.exports = CreatePurchaseOrderManager;
