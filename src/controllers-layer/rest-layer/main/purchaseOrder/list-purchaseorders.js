const { ListPurchaseOrdersManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class ListPurchaseOrdersRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("listPurchaseOrders", "listpurchaseorders", req, res);
    this.dataName = "purchaseOrders";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListPurchaseOrdersManager(this._req, "rest");
  }
}

const listPurchaseOrders = async (req, res, next) => {
  const listPurchaseOrdersRestController = new ListPurchaseOrdersRestController(
    req,
    res,
  );
  try {
    await listPurchaseOrdersRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listPurchaseOrders;
