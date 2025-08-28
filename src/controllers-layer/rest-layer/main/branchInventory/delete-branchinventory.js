const { DeleteBranchInventoryManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class DeleteBranchInventoryRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("deleteBranchInventory", "deletebranchinventory", req, res);
    this.dataName = "branchInventory";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteBranchInventoryManager(this._req, "rest");
  }
}

const deleteBranchInventory = async (req, res, next) => {
  const deleteBranchInventoryRestController =
    new DeleteBranchInventoryRestController(req, res);
  try {
    await deleteBranchInventoryRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteBranchInventory;
