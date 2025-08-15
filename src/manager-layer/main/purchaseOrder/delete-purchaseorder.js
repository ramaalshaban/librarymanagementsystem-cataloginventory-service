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
const { dbDeletePurchaseorder } = require("dbLayer");

class DeletePurchaseOrderManager extends PurchaseOrderManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deletePurchaseOrder",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
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
    // make an awaited call to the dbDeletePurchaseorder function to delete the purchaseorder and return the result to the controller
    const purchaseorder = await dbDeletePurchaseorder(this);

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

module.exports = DeletePurchaseOrderManager;
