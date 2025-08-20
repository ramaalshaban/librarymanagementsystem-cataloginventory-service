const { QueryCache, QueryCacheInvalidator } = require("common");

class PurchaseOrderQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("purchaseOrder", [], "$and", "$eq", input, wClause);
  }
}
class PurchaseOrderQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("purchaseOrder", []);
  }
}

module.exports = {
  PurchaseOrderQueryCache,
  PurchaseOrderQueryCacheInvalidator,
};
