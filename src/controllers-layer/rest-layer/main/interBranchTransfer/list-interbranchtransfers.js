const { ListInterBranchTransfersManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class ListInterBranchTransfersRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("listInterBranchTransfers", "listinterbranchtransfers", req, res);
    this.dataName = "interBranchTransfers";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListInterBranchTransfersManager(this._req, "rest");
  }
}

const listInterBranchTransfers = async (req, res, next) => {
  const listInterBranchTransfersRestController =
    new ListInterBranchTransfersRestController(req, res);
  try {
    await listInterBranchTransfersRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listInterBranchTransfers;
