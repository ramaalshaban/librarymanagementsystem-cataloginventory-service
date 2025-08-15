const { GetInterBranchTransferManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class GetInterBranchTransferRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("getInterBranchTransfer", "getinterbranchtransfer", req, res);
    this.dataName = "interBranchTransfer";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetInterBranchTransferManager(this._req, "rest");
  }
}

const getInterBranchTransfer = async (req, res, next) => {
  const getInterBranchTransferRestController =
    new GetInterBranchTransferRestController(req, res);
  try {
    await getInterBranchTransferRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getInterBranchTransfer;
