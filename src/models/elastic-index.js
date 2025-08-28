const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const bookMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  title: { type: "keyword", index: true },
  authors: { type: "keyword", index: true },
  isbn: { type: "keyword", index: true },
  synopsis: { type: "text", index: true },
  genres: { type: "keyword", index: true },
  publicationDate: { type: "date", index: false },
  language: { type: "keyword", index: true },
  publisher: { type: "keyword", index: false },
  coverImageUrl: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const branchMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  name: { type: "keyword", index: true },
  address: { properties: {} },
  geoLocation: { type: "object", enabled: false },
  contactEmail: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const branchInventoryMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  bookId: { type: "keyword", index: true },
  branchId: { type: "keyword", index: true },
  totalCopies: { type: "integer", index: false },
  availableCopies: { type: "integer", index: false },
  localShelfLocation: { type: "keyword", index: false },
  conditionNotes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const inventoryAuditLogMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  branchId: { type: "keyword", index: false },
  branchInventoryId: { type: "keyword", index: false },
  auditType: { type: "keyword", index: false },
  auditType_: { type: "keyword" },
  detailNote: { type: "text", index: false },
  adjustmentValue: { type: "integer", index: false },
  recordedByUserId: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const interBranchTransferMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  bookId: { type: "keyword", index: false },
  sourceBranchId: { type: "keyword", index: false },
  destBranchId: { type: "keyword", index: false },
  quantity: { type: "integer", index: false },
  requestedByUserId: { type: "keyword", index: false },
  status: { type: "keyword", index: false },
  status_: { type: "keyword" },
  transferLog: { type: "object", enabled: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const purchaseOrderMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  branchId: { type: "keyword", index: false },
  requestedByUserId: { type: "keyword", index: false },
  itemRequests: { type: "object", enabled: false },
  status: { type: "keyword", index: false },
  status_: { type: "keyword" },
  approvalNotes: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const catalogInventoryShareTokenMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  configName: { type: "keyword", index: true },
  objectName: { type: "keyword", index: true },
  objectId: { type: "keyword", index: true },
  ownerId: { type: "keyword", index: true },
  peopleOption: { type: "keyword", index: true },
  tokenPermissions: { type: "keyword", index: true },
  allowedEmails: { type: "keyword", index: true },
  expireDate: { type: "date", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("book", bookMapping);
    await new ElasticIndexer("book").updateMapping(bookMapping);
    ElasticIndexer.addMapping("branch", branchMapping);
    await new ElasticIndexer("branch").updateMapping(branchMapping);
    ElasticIndexer.addMapping("branchInventory", branchInventoryMapping);
    await new ElasticIndexer("branchInventory").updateMapping(
      branchInventoryMapping,
    );
    ElasticIndexer.addMapping("inventoryAuditLog", inventoryAuditLogMapping);
    await new ElasticIndexer("inventoryAuditLog").updateMapping(
      inventoryAuditLogMapping,
    );
    ElasticIndexer.addMapping(
      "interBranchTransfer",
      interBranchTransferMapping,
    );
    await new ElasticIndexer("interBranchTransfer").updateMapping(
      interBranchTransferMapping,
    );
    ElasticIndexer.addMapping("purchaseOrder", purchaseOrderMapping);
    await new ElasticIndexer("purchaseOrder").updateMapping(
      purchaseOrderMapping,
    );
    ElasticIndexer.addMapping(
      "catalogInventoryShareToken",
      catalogInventoryShareTokenMapping,
    );
    await new ElasticIndexer("catalogInventoryShareToken").updateMapping(
      catalogInventoryShareTokenMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
