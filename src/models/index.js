const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const Book = require("./book");
const Branch = require("./branch");
const BranchInventory = require("./branchInventory");
const InventoryAuditLog = require("./inventoryAuditLog");
const InterBranchTransfer = require("./interBranchTransfer");
const PurchaseOrder = require("./purchaseOrder");
const CatalogInventoryShareToken = require("./catalogInventoryShareToken");

Book.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

Branch.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

BranchInventory.prototype.getData = function () {
  const data = this.dataValues;

  data.book = this.book ? this.book.getData() : undefined;
  data.branch = this.branch ? this.branch.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  return data;
};

BranchInventory.belongsTo(Book, {
  as: "book",
  foreignKey: "bookId",
  targetKey: "id",
  constraints: false,
});

BranchInventory.belongsTo(Branch, {
  as: "branch",
  foreignKey: "branchId",
  targetKey: "id",
  constraints: false,
});

InventoryAuditLog.prototype.getData = function () {
  const data = this.dataValues;

  data.branch = this.branch ? this.branch.getData() : undefined;
  data.branchInventory = this.branchInventory
    ? this.branchInventory.getData()
    : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const auditTypeOptions = [
    "audit",
    "damage",
    "loss",
    "discrepancy",
    "adjustment",
  ];
  const dataTypeauditTypeInventoryAuditLog = typeof data.auditType;
  const enumIndexauditTypeInventoryAuditLog =
    dataTypeauditTypeInventoryAuditLog === "string"
      ? auditTypeOptions.indexOf(data.auditType)
      : data.auditType;
  data.auditType_idx = enumIndexauditTypeInventoryAuditLog;
  data.auditType =
    enumIndexauditTypeInventoryAuditLog > -1
      ? auditTypeOptions[enumIndexauditTypeInventoryAuditLog]
      : undefined;

  return data;
};

InventoryAuditLog.belongsTo(Branch, {
  as: "branch",
  foreignKey: "branchId",
  targetKey: "id",
  constraints: false,
});

InventoryAuditLog.belongsTo(BranchInventory, {
  as: "branchInventory",
  foreignKey: "branchInventoryId",
  targetKey: "id",
  constraints: false,
});

InterBranchTransfer.prototype.getData = function () {
  const data = this.dataValues;

  data.book = this.book ? this.book.getData() : undefined;
  data.sourceBranch = this.sourceBranch
    ? this.sourceBranch.getData()
    : undefined;
  data.destBranch = this.destBranch ? this.destBranch.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const statusOptions = [
    "requested",
    "approved",
    "inTransit",
    "completed",
    "rejected",
    "canceled",
  ];
  const dataTypestatusInterBranchTransfer = typeof data.status;
  const enumIndexstatusInterBranchTransfer =
    dataTypestatusInterBranchTransfer === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusInterBranchTransfer;
  data.status =
    enumIndexstatusInterBranchTransfer > -1
      ? statusOptions[enumIndexstatusInterBranchTransfer]
      : undefined;

  return data;
};

InterBranchTransfer.belongsTo(Book, {
  as: "book",
  foreignKey: "bookId",
  targetKey: "id",
  constraints: false,
});

InterBranchTransfer.belongsTo(Branch, {
  as: "sourceBranch",
  foreignKey: "sourceBranchId",
  targetKey: "id",
  constraints: false,
});

InterBranchTransfer.belongsTo(Branch, {
  as: "destBranch",
  foreignKey: "destBranchId",
  targetKey: "id",
  constraints: false,
});

PurchaseOrder.prototype.getData = function () {
  const data = this.dataValues;

  data.branch = this.branch ? this.branch.getData() : undefined;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const statusOptions = [
    "requested",
    "approved",
    "rejected",
    "fulfilled",
    "canceled",
  ];
  const dataTypestatusPurchaseOrder = typeof data.status;
  const enumIndexstatusPurchaseOrder =
    dataTypestatusPurchaseOrder === "string"
      ? statusOptions.indexOf(data.status)
      : data.status;
  data.status_idx = enumIndexstatusPurchaseOrder;
  data.status =
    enumIndexstatusPurchaseOrder > -1
      ? statusOptions[enumIndexstatusPurchaseOrder]
      : undefined;

  return data;
};

PurchaseOrder.belongsTo(Branch, {
  as: "branch",
  foreignKey: "branchId",
  targetKey: "id",
  constraints: false,
});

CatalogInventoryShareToken.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  data._owner = data.ownerId ?? undefined;
  return data;
};

module.exports = {
  Book,
  Branch,
  BranchInventory,
  InventoryAuditLog,
  InterBranchTransfer,
  PurchaseOrder,
  CatalogInventoryShareToken,
  updateElasticIndexMappings,
};
