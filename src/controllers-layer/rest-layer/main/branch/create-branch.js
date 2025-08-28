const { CreateBranchManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class CreateBranchRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("createBranch", "createbranch", req, res);
    this.dataName = "branch";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateBranchManager(this._req, "rest");
  }
}

const createBranch = async (req, res, next) => {
  const createBranchRestController = new CreateBranchRestController(req, res);
  try {
    await createBranchRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createBranch;
