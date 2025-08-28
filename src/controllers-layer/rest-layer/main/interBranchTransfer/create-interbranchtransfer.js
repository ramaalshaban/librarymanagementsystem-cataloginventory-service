const { CreateInterBranchTransferManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class CreateInterBranchTransferRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("createInterBranchTransfer", "createinterbranchtransfer", req, res);
    this.dataName = "interBranchTransfer";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateInterBranchTransferManager(this._req, "rest");
  }
}

const createInterBranchTransfer = async (req, res, next) => {
  const createInterBranchTransferRestController =
    new CreateInterBranchTransferRestController(req, res);
  try {
    await createInterBranchTransferRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createInterBranchTransfer;
