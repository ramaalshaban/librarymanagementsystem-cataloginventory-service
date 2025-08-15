const { ListInventoryAuditLogsManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class ListInventoryAuditLogsRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("listInventoryAuditLogs", "listinventoryauditlogs", req, res);
    this.dataName = "inventoryAuditLogs";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListInventoryAuditLogsManager(this._req, "rest");
  }
}

const listInventoryAuditLogs = async (req, res, next) => {
  const listInventoryAuditLogsRestController =
    new ListInventoryAuditLogsRestController(req, res);
  try {
    await listInventoryAuditLogsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listInventoryAuditLogs;
