const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class InventoryAuditLogQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("inventoryAuditLog", [], Op.and, Op.eq, input, wClause);
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
