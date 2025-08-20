const { QueryCache, QueryCacheInvalidator } = require("common");

class BranchQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("branch", [], "$and", "$eq", input, wClause);
  }
}
class BranchQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("branch", []);
  }
}

module.exports = {
  BranchQueryCache,
  BranchQueryCacheInvalidator,
};
