const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CatalogInventoryServiceManager = require("../../service-manager/CatalogInventoryServiceManager");

/* Base Class For the Crud Routes Of DbObject Branch */
class BranchManager extends CatalogInventoryServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "branch";
    this.modelName = "Branch";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = BranchManager;
