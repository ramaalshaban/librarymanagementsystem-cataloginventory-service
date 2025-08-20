const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class PurchaseOrderQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("purchaseOrder", [], Op.and, Op.eq, input, wClause);
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
