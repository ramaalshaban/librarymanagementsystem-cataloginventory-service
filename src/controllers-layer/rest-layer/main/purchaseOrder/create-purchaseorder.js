const { CreatePurchaseOrderManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class CreatePurchaseOrderRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("createPurchaseOrder", "createpurchaseorder", req, res);
    this.dataName = "purchaseOrder";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreatePurchaseOrderManager(this._req, "rest");
  }
}

const createPurchaseOrder = async (req, res, next) => {
  const createPurchaseOrderRestController =
    new CreatePurchaseOrderRestController(req, res);
  try {
    await createPurchaseOrderRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createPurchaseOrder;
