const InventoryAuditLogManager = require("./InventoryAuditLogManager");
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
const { dbGetInventoryauditlog } = require("dbLayer");

class GetInventoryAuditLogManager extends InventoryAuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getInventoryAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "inventoryAuditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.inventoryAuditLogId = this.inventoryAuditLogId;
  }

  readRestParameters(request) {
    this.inventoryAuditLogId = request.params?.inventoryAuditLogId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.inventoryAuditLogId = request.mcpParams.inventoryAuditLogId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.inventoryAuditLogId == null) {
      throw new BadRequestError("errMsg_inventoryAuditLogIdisRequired");
    }

    // ID
    if (
      this.inventoryAuditLogId &&
      !isValidObjectId(this.inventoryAuditLogId) &&
      !isValidUUID(this.inventoryAuditLogId)
    ) {
      throw new BadRequestError("errMsg_inventoryAuditLogIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.inventoryAuditLog?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetInventoryauditlog function to get the inventoryauditlog and return the result to the controller
    const inventoryauditlog = await dbGetInventoryauditlog(this);

    return inventoryauditlog;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.inventoryAuditLogId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = GetInventoryAuditLogManager;
