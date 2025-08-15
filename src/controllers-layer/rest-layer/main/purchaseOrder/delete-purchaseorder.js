const { DeletePurchaseOrderManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class DeletePurchaseOrderRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("deletePurchaseOrder", "deletepurchaseorder", req, res);
    this.dataName = "purchaseOrder";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeletePurchaseOrderManager(this._req, "rest");
  }
}

const deletePurchaseOrder = async (req, res, next) => {
  const deletePurchaseOrderRestController =
    new DeletePurchaseOrderRestController(req, res);
  try {
    await deletePurchaseOrderRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deletePurchaseOrder;
