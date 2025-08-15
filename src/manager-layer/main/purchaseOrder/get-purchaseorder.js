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
const { dbGetPurchaseorder } = require("dbLayer");

class GetPurchaseOrderManager extends PurchaseOrderManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getPurchaseOrder",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "purchaseOrder";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.purchaseOrderId = this.purchaseOrderId;
  }

  readRestParameters(request) {
    this.purchaseOrderId = request.params?.purchaseOrderId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.purchaseOrderId = request.mcpParams.purchaseOrderId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

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
    // make an awaited call to the dbGetPurchaseorder function to get the purchaseorder and return the result to the controller
    const purchaseorder = await dbGetPurchaseorder(this);

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
}

module.exports = GetPurchaseOrderManager;
