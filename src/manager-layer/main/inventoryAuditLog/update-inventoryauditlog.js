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
const { dbUpdateInventoryauditlog } = require("dbLayer");

class UpdateInventoryAuditLogManager extends InventoryAuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateInventoryAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "inventoryAuditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.inventoryAuditLogId = this.inventoryAuditLogId;
    jsonObj.auditType = this.auditType;
    jsonObj.detailNote = this.detailNote;
    jsonObj.adjustmentValue = this.adjustmentValue;
  }

  readRestParameters(request) {
    this.inventoryAuditLogId = request.params?.inventoryAuditLogId;
    this.auditType = request.body?.auditType;
    this.detailNote = request.body?.detailNote;
    this.adjustmentValue = request.body?.adjustmentValue;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.inventoryAuditLogId = request.mcpParams.inventoryAuditLogId;
    this.auditType = request.mcpParams.auditType;
    this.detailNote = request.mcpParams.detailNote;
    this.adjustmentValue = request.mcpParams.adjustmentValue;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getInventoryAuditLogById } = require("dbLayer");
    this.inventoryAuditLog = await getInventoryAuditLogById(
      this.inventoryAuditLogId,
    );
    if (!this.inventoryAuditLog) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

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
    // make an awaited call to the dbUpdateInventoryauditlog function to update the inventoryauditlog and return the result to the controller
    const inventoryauditlog = await dbUpdateInventoryauditlog(this);

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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      auditType: this.auditType,
      detailNote: this.detailNote,
      adjustmentValue: this.adjustmentValue,
    };

    return dataClause;
  }
}

module.exports = UpdateInventoryAuditLogManager;
