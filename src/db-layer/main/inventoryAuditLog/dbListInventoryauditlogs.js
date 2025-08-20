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

class DbListInventoryauditlogsCommand extends DBGetListSequelizeCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbListInventoryauditlogs";
    this.emptyResult = true;
    this.objectName = "inventoryAuditLogs";
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
    for (const inventoryAuditLog of this.dbData.items) {
      // tarnspose dbData item
    }
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }

  async getCqrsJoins(item) {
    if (InventoryAuditLog.getCqrsJoins) {
      await InventoryAuditLog.getCqrsJoins(item);
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

    let inventoryAuditLogs = null;

    const selectList = this.getSelectList();
    if (selectList && selectList.length) {
      options.attributes = selectList;
    }

    inventoryAuditLogs = await InventoryAuditLog.findAll(options);

    return inventoryAuditLogs;
  }
}

const dbListInventoryauditlogs = (input) => {
  const dbGetListCommand = new DbListInventoryauditlogsCommand(input);
  return dbGetListCommand.execute();
};

module.exports = dbListInventoryauditlogs;
