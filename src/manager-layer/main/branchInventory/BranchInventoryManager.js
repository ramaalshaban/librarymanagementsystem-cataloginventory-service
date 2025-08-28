const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CatalogInventoryServiceManager = require("../../service-manager/CatalogInventoryServiceManager");

/* Base Class For the Crud Routes Of DbObject BranchInventory */
class BranchInventoryManager extends CatalogInventoryServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "branchInventory";
    this.modelName = "BranchInventory";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = BranchInventoryManager;
