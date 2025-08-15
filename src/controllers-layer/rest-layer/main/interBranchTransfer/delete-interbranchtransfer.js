const { DeleteInterBranchTransferManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class DeleteInterBranchTransferRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("deleteInterBranchTransfer", "deleteinterbranchtransfer", req, res);
    this.dataName = "interBranchTransfer";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteInterBranchTransferManager(this._req, "rest");
  }
}

const deleteInterBranchTransfer = async (req, res, next) => {
  const deleteInterBranchTransferRestController =
    new DeleteInterBranchTransferRestController(req, res);
  try {
    await deleteInterBranchTransferRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteInterBranchTransfer;
