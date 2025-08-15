const BranchInventoryManager = require("./BranchInventoryManager");
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
const { dbCreateBranchinventory } = require("dbLayer");

class CreateBranchInventoryManager extends BranchInventoryManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createBranchInventory",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "branchInventory";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.bookId = this.bookId;
    jsonObj.branchId = this.branchId;
    jsonObj.totalCopies = this.totalCopies;
    jsonObj.availableCopies = this.availableCopies;
    jsonObj.localShelfLocation = this.localShelfLocation;
    jsonObj.conditionNotes = this.conditionNotes;
  }

  readRestParameters(request) {
    this.bookId = request.body?.bookId;
    this.branchId = request.body?.branchId;
    this.totalCopies = request.body?.totalCopies;
    this.availableCopies = request.body?.availableCopies;
    this.localShelfLocation = request.body?.localShelfLocation;
    this.conditionNotes = request.body?.conditionNotes;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.bookId = request.mcpParams.bookId;
    this.branchId = request.mcpParams.branchId;
    this.totalCopies = request.mcpParams.totalCopies;
    this.availableCopies = request.mcpParams.availableCopies;
    this.localShelfLocation = request.mcpParams.localShelfLocation;
    this.conditionNotes = request.mcpParams.conditionNotes;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.bookId == null) {
      throw new BadRequestError("errMsg_bookIdisRequired");
    }

    if (this.branchId == null) {
      throw new BadRequestError("errMsg_branchIdisRequired");
    }

    if (this.totalCopies == null) {
      throw new BadRequestError("errMsg_totalCopiesisRequired");
    }

    if (this.availableCopies == null) {
      throw new BadRequestError("errMsg_availableCopiesisRequired");
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
      this.branchId &&
      !isValidObjectId(this.branchId) &&
      !isValidUUID(this.branchId)
    ) {
      throw new BadRequestError("errMsg_branchIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.branchInventory?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateBranchinventory function to create the branchinventory and return the result to the controller
    const branchinventory = await dbCreateBranchinventory(this);

    return branchinventory;
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.branchInventoryId = this.id;
    if (!this.branchInventoryId) this.branchInventoryId = newObjectId();

    const dataClause = {
      _id: this.branchInventoryId,
      bookId: this.bookId,
      branchId: this.branchId,
      totalCopies: this.totalCopies,
      availableCopies: this.availableCopies,
      localShelfLocation: this.localShelfLocation,
      conditionNotes: this.conditionNotes,
    };

    return dataClause;
  }
}

module.exports = CreateBranchInventoryManager;
