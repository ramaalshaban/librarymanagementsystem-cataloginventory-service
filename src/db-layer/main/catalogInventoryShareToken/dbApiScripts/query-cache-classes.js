const { QueryCache, QueryCacheInvalidator } = require("common");

class CatalogInventoryShareTokenQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("catalogInventoryShareToken", [], "$and", "$eq", input, wClause);
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
