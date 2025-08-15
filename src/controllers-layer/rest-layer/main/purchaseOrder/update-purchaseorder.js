const { UpdatePurchaseOrderManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class UpdatePurchaseOrderRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("updatePurchaseOrder", "updatepurchaseorder", req, res);
    this.dataName = "purchaseOrder";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdatePurchaseOrderManager(this._req, "rest");
  }
}

const updatePurchaseOrder = async (req, res, next) => {
  const updatePurchaseOrderRestController =
    new UpdatePurchaseOrderRestController(req, res);
  try {
    await updatePurchaseOrderRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updatePurchaseOrder;
