const { GetBranchInventoryManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class GetBranchInventoryRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("getBranchInventory", "getbranchinventory", req, res);
    this.dataName = "branchInventory";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetBranchInventoryManager(this._req, "rest");
  }
}

const getBranchInventory = async (req, res, next) => {
  const getBranchInventoryRestController = new GetBranchInventoryRestController(
    req,
    res,
  );
  try {
    await getBranchInventoryRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getBranchInventory;
