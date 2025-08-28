const { UpdateBranchInventoryManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class UpdateBranchInventoryRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("updateBranchInventory", "updatebranchinventory", req, res);
    this.dataName = "branchInventory";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateBranchInventoryManager(this._req, "rest");
  }
}

const updateBranchInventory = async (req, res, next) => {
  const updateBranchInventoryRestController =
    new UpdateBranchInventoryRestController(req, res);
  try {
    await updateBranchInventoryRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateBranchInventory;
