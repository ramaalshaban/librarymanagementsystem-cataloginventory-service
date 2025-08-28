const { QueryCache, QueryCacheInvalidator } = require("common");

class InventoryAuditLogQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("inventoryAuditLog", [], "$and", "$eq", input, wClause);
  }
}
class InventoryAuditLogQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("inventoryAuditLog", []);
  }
}

module.exports = {
  InventoryAuditLogQueryCache,
  InventoryAuditLogQueryCacheInvalidator,
};
