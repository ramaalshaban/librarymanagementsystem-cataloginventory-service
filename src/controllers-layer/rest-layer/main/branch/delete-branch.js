const { DeleteBranchManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class DeleteBranchRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("deleteBranch", "deletebranch", req, res);
    this.dataName = "branch";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteBranchManager(this._req, "rest");
  }
}

const deleteBranch = async (req, res, next) => {
  const deleteBranchRestController = new DeleteBranchRestController(req, res);
  try {
    await deleteBranchRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteBranch;
