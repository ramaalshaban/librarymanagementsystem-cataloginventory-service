const { UpdateInterBranchTransferManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class UpdateInterBranchTransferRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("updateInterBranchTransfer", "updateinterbranchtransfer", req, res);
    this.dataName = "interBranchTransfer";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateInterBranchTransferManager(this._req, "rest");
  }
}

const updateInterBranchTransfer = async (req, res, next) => {
  const updateInterBranchTransferRestController =
    new UpdateInterBranchTransferRestController(req, res);
  try {
    await updateInterBranchTransferRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateInterBranchTransfer;
