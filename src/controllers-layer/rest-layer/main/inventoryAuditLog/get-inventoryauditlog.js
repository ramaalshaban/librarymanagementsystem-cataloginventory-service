const { GetInventoryAuditLogManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class GetInventoryAuditLogRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("getInventoryAuditLog", "getinventoryauditlog", req, res);
    this.dataName = "inventoryAuditLog";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetInventoryAuditLogManager(this._req, "rest");
  }
}

const getInventoryAuditLog = async (req, res, next) => {
  const getInventoryAuditLogRestController =
    new GetInventoryAuditLogRestController(req, res);
  try {
    await getInventoryAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getInventoryAuditLog;
