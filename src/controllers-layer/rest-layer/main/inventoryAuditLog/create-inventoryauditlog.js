const { CreateInventoryAuditLogManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class CreateInventoryAuditLogRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("createInventoryAuditLog", "createinventoryauditlog", req, res);
    this.dataName = "inventoryAuditLog";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateInventoryAuditLogManager(this._req, "rest");
  }
}

const createInventoryAuditLog = async (req, res, next) => {
  const createInventoryAuditLogRestController =
    new CreateInventoryAuditLogRestController(req, res);
  try {
    await createInventoryAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createInventoryAuditLog;
