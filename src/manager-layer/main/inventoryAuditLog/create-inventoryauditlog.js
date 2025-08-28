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
const { dbCreateInventoryauditlog } = require("dbLayer");

class CreateInventoryAuditLogManager extends InventoryAuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createInventoryAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "inventoryAuditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.branchId = this.branchId;
    jsonObj.branchInventoryId = this.branchInventoryId;
    jsonObj.auditType = this.auditType;
    jsonObj.detailNote = this.detailNote;
    jsonObj.adjustmentValue = this.adjustmentValue;
    jsonObj.recordedByUserId = this.recordedByUserId;
  }

  readRestParameters(request) {
    this.branchId = request.body?.branchId;
    this.branchInventoryId = request.body?.branchInventoryId;
    this.auditType = request.body?.auditType;
    this.detailNote = request.body?.detailNote;
    this.adjustmentValue = request.body?.adjustmentValue;
    this.recordedByUserId = request.session?.userId;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.branchId = request.mcpParams.branchId;
    this.branchInventoryId = request.mcpParams.branchInventoryId;
    this.auditType = request.mcpParams.auditType;
    this.detailNote = request.mcpParams.detailNote;
    this.adjustmentValue = request.mcpParams.adjustmentValue;
    this.recordedByUserId = request.session.userId;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.branchId == null) {
      throw new BadRequestError("errMsg_branchIdisRequired");
    }

    if (this.branchInventoryId == null) {
      throw new BadRequestError("errMsg_branchInventoryIdisRequired");
    }

    if (this.auditType == null) {
      throw new BadRequestError("errMsg_auditTypeisRequired");
    }

    if (this.recordedByUserId == null) {
      throw new BadRequestError("errMsg_recordedByUserIdisRequired");
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
      this.branchInventoryId &&
      !isValidObjectId(this.branchInventoryId) &&
      !isValidUUID(this.branchInventoryId)
    ) {
      throw new BadRequestError("errMsg_branchInventoryIdisNotAValidID");
    }

    // ID
    if (
      this.recordedByUserId &&
      !isValidObjectId(this.recordedByUserId) &&
      !isValidUUID(this.recordedByUserId)
    ) {
      throw new BadRequestError("errMsg_recordedByUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.inventoryAuditLog?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateInventoryauditlog function to create the inventoryauditlog and return the result to the controller
    const inventoryauditlog = await dbCreateInventoryauditlog(this);

    return inventoryauditlog;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.inventoryAuditLogId = this.id;
    if (!this.inventoryAuditLogId) this.inventoryAuditLogId = newObjectId();

    const dataClause = {
      _id: this.inventoryAuditLogId,
      branchId: this.branchId,
      branchInventoryId: this.branchInventoryId,
      auditType: this.auditType,
      detailNote: this.detailNote,
      adjustmentValue: this.adjustmentValue,
      recordedByUserId: this.recordedByUserId,
    };

    return dataClause;
  }
}

module.exports = CreateInventoryAuditLogManager;
