const { UpdateInventoryAuditLogManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class UpdateInventoryAuditLogRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("updateInventoryAuditLog", "updateinventoryauditlog", req, res);
    this.dataName = "inventoryAuditLog";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateInventoryAuditLogManager(this._req, "rest");
  }
}

const updateInventoryAuditLog = async (req, res, next) => {
  const updateInventoryAuditLogRestController =
    new UpdateInventoryAuditLogRestController(req, res);
  try {
    await updateInventoryAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateInventoryAuditLog;
