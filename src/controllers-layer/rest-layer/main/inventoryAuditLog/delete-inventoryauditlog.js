const { DeleteInventoryAuditLogManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class DeleteInventoryAuditLogRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("deleteInventoryAuditLog", "deleteinventoryauditlog", req, res);
    this.dataName = "inventoryAuditLog";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteInventoryAuditLogManager(this._req, "rest");
  }
}

const deleteInventoryAuditLog = async (req, res, next) => {
  const deleteInventoryAuditLogRestController =
    new DeleteInventoryAuditLogRestController(req, res);
  try {
    await deleteInventoryAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteInventoryAuditLog;
