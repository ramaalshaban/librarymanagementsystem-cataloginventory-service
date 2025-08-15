const ApiManager = require("./ApiManager");

class CatalogInventoryServiceManager extends ApiManager {
  constructor(request, options) {
    super(request, options);
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }
}

module.exports = CatalogInventoryServiceManager;
