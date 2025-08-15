const { GetPurchaseOrderManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class GetPurchaseOrderRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("getPurchaseOrder", "getpurchaseorder", req, res);
    this.dataName = "purchaseOrder";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPurchaseOrderManager(this._req, "rest");
  }
}

const getPurchaseOrder = async (req, res, next) => {
  const getPurchaseOrderRestController = new GetPurchaseOrderRestController(
    req,
    res,
  );
  try {
    await getPurchaseOrderRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPurchaseOrder;
