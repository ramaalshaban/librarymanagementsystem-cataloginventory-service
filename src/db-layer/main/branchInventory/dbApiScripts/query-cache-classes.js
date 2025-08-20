const { QueryCache, QueryCacheInvalidator } = require("common");

class BranchInventoryQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("branchInventory", [], "$and", "$eq", input, wClause);
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
