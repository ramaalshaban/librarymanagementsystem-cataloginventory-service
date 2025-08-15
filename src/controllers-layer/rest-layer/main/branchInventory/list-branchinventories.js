const { ListBranchInventoriesManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class ListBranchInventoriesRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("listBranchInventories", "listbranchinventories", req, res);
    this.dataName = "branchInventories";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListBranchInventoriesManager(this._req, "rest");
  }
}

const listBranchInventories = async (req, res, next) => {
  const listBranchInventoriesRestController =
    new ListBranchInventoriesRestController(req, res);
  try {
    await listBranchInventoriesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listBranchInventories;
