const { ListBranchesManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class ListBranchesRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("listBranches", "listbranches", req, res);
    this.dataName = "branches";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListBranchesManager(this._req, "rest");
  }
}

const listBranches = async (req, res, next) => {
  const listBranchesRestController = new ListBranchesRestController(req, res);
  try {
    await listBranchesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listBranches;
