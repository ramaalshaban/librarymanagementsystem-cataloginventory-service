const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class CatalogInventoryShareTokenQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("catalogInventoryShareToken", [], Op.and, Op.eq, input, wClause);
  }
}
class CatalogInventoryShareTokenQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("catalogInventoryShareToken", []);
  }
}

module.exports = {
  CatalogInventoryShareTokenQueryCache,
  CatalogInventoryShareTokenQueryCacheInvalidator,
};
