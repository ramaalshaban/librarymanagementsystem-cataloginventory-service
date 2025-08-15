const { CreateBranchInventoryManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class CreateBranchInventoryRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("createBranchInventory", "createbranchinventory", req, res);
    this.dataName = "branchInventory";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateBranchInventoryManager(this._req, "rest");
  }
}

const createBranchInventory = async (req, res, next) => {
  const createBranchInventoryRestController =
    new CreateBranchInventoryRestController(req, res);
  try {
    await createBranchInventoryRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createBranchInventory;
