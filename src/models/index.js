const { mongoose } = require("common");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");

const bookSchema = require("./book");

const branchSchema = require("./branch");

const branchinventorySchema = require("./branchInventory");

const inventoryauditlogSchema = require("./inventoryAuditLog");

const interbranchtransferSchema = require("./interBranchTransfer");

const purchaseorderSchema = require("./purchaseOrder");

const cataloginventorysharetokenSchema = require("./catalogInventoryShareToken");

bookSchema.methods.getCqrsJoins = async function (data) {};

bookSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  return ret;
};

branchSchema.methods.getCqrsJoins = async function (data) {};

branchSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  return ret;
};

branchinventorySchema.methods.getCqrsJoins = async function (data) {};

branchinventorySchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  return ret;
};

inventoryauditlogSchema.methods.getCqrsJoins = async function (data) {};

inventoryauditlogSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const auditTypeOptions = [
    "audit",
    "damage",
    "loss",
    "discrepancy",
    "adjustment",
  ];
  if (ret.auditType != null) {
    const enumIndex =
      typeof ret.auditType === "string"
        ? auditTypeOptions.indexOf(ret.auditType)
        : ret.auditType;
    ret.auditType_idx = enumIndex;
    ret.auditType = enumIndex > -1 ? auditTypeOptions[enumIndex] : undefined;
  }

  return ret;
};

interbranchtransferSchema.methods.getCqrsJoins = async function (data) {};

interbranchtransferSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const statusOptions = [
    "requested",
    "approved",
    "inTransit",
    "completed",
    "rejected",
    "canceled",
  ];
  if (ret.status != null) {
    const enumIndex =
      typeof ret.status === "string"
        ? statusOptions.indexOf(ret.status)
        : ret.status;
    ret.status_idx = enumIndex;
    ret.status = enumIndex > -1 ? statusOptions[enumIndex] : undefined;
  }

  return ret;
};

purchaseorderSchema.methods.getCqrsJoins = async function (data) {};

purchaseorderSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const statusOptions = [
    "requested",
    "approved",
    "rejected",
    "fulfilled",
    "canceled",
  ];
  if (ret.status != null) {
    const enumIndex =
      typeof ret.status === "string"
        ? statusOptions.indexOf(ret.status)
        : ret.status;
    ret.status_idx = enumIndex;
    ret.status = enumIndex > -1 ? statusOptions[enumIndex] : undefined;
  }

  return ret;
};

cataloginventorysharetokenSchema.methods.getCqrsJoins = async function (
  data,
) {};

cataloginventorysharetokenSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  ret._owner = ret.ownerId ?? undefined;

  return ret;
};

const Book = mongoose.model("Book", bookSchema);
const Branch = mongoose.model("Branch", branchSchema);
const BranchInventory = mongoose.model(
  "BranchInventory",
  branchinventorySchema,
);
const InventoryAuditLog = mongoose.model(
  "InventoryAuditLog",
  inventoryauditlogSchema,
);
const InterBranchTransfer = mongoose.model(
  "InterBranchTransfer",
  interbranchtransferSchema,
);
const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseorderSchema);
const CatalogInventoryShareToken = mongoose.model(
  "CatalogInventoryShareToken",
  cataloginventorysharetokenSchema,
);

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
