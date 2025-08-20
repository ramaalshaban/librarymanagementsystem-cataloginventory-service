const { DBGetListSequelizeCommand } = require("dbCommand");
const { sequelize, hexaLogger } = require("common");
const { Op } = require("sequelize");
const {
  Book,
  Branch,
  BranchInventory,
  InventoryAuditLog,
  InterBranchTransfer,
  PurchaseOrder,
  CatalogInventoryShareToken,
} = require("models");

class DbListPurchaseordersCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListPurchaseorders";
    this.emptyResult = true;
    this.objectName = "purchaseOrders";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.input.pagination = null;
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  // should i add this here?

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    for (const purchaseOrder of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (PurchaseOrder.getCqrsJoins) {
      await PurchaseOrder.getCqrsJoins(item);
    }
  }

  async executeQuery() {
    const input = this.input;
    let options = { where: this.whereClause };
    if (input.sortBy) options.order = input.sortBy ?? [["id", "ASC"]];

    options.include = this.buildIncludes();
    if (options.include && options.include.length == 0) options.include = null;

    if (!input.getJoins) {
      options.include = null;
    }

    let purchaseOrders = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    purchaseOrders = await PurchaseOrder.findAll(options);

    return purchaseOrders;
  }
}

const dbListPurchaseorders = (input) => {
  const dbGetListCommand = new DbListPurchaseordersCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListPurchaseorders;
