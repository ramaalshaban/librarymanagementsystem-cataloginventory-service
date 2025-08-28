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
const { dbUpdatePurchaseorder } = require("dbLayer");

class UpdatePurchaseOrderManager extends PurchaseOrderManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updatePurchaseOrder",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "purchaseOrder";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.purchaseOrderId = this.purchaseOrderId;
    jsonObj.itemRequests = this.itemRequests;
    jsonObj.status = this.status;
    jsonObj.approvalNotes = this.approvalNotes;
  }

  readRestParameters(request) {
    this.purchaseOrderId = request.params?.purchaseOrderId;
    this.itemRequests = request.body?.itemRequests;
    this.status = request.body?.status;
    this.approvalNotes = request.body?.approvalNotes;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.purchaseOrderId = request.mcpParams.purchaseOrderId;
    this.itemRequests = request.mcpParams.itemRequests;
    this.status = request.mcpParams.status;
    this.approvalNotes = request.mcpParams.approvalNotes;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getPurchaseOrderById } = require("dbLayer");
    this.purchaseOrder = await getPurchaseOrderById(this.purchaseOrderId);
    if (!this.purchaseOrder) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.purchaseOrderId == null) {
      throw new BadRequestError("errMsg_purchaseOrderIdisRequired");
    }

    // ID
    if (
      this.purchaseOrderId &&
      !isValidObjectId(this.purchaseOrderId) &&
      !isValidUUID(this.purchaseOrderId)
    ) {
      throw new BadRequestError("errMsg_purchaseOrderIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.purchaseOrder?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdatePurchaseorder function to update the purchaseorder and return the result to the controller
    const purchaseorder = await dbUpdatePurchaseorder(this);

    return purchaseorder;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.purchaseOrderId }, { isActive: true }] };

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

module.exports = UpdatePurchaseOrderManager;
