const { UpdateBranchManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class UpdateBranchRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("updateBranch", "updatebranch", req, res);
    this.dataName = "branch";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateBranchManager(this._req, "rest");
  }
}

const updateBranch = async (req, res, next) => {
  const updateBranchRestController = new UpdateBranchRestController(req, res);
  try {
    await updateBranchRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateBranch;
