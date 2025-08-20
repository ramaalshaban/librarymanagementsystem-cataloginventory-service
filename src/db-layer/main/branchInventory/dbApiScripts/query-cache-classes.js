const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class BranchInventoryQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("branchInventory", [], Op.and, Op.eq, input, wClause);
  }
}
class BranchInventoryQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("branchInventory", []);
  }
}

module.exports = {
  BranchInventoryQueryCache,
  BranchInventoryQueryCacheInvalidator,
};
