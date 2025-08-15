const { GetBranchManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class GetBranchRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("getBranch", "getbranch", req, res);
    this.dataName = "branch";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetBranchManager(this._req, "rest");
  }
}

const getBranch = async (req, res, next) => {
  const getBranchRestController = new GetBranchRestController(req, res);
  try {
    await getBranchRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getBranch;
