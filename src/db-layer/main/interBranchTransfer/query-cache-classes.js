const { QueryCache, QueryCacheInvalidator } = require("common");

class InterBranchTransferQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("interBranchTransfer", [], "$and", "$eq", input, wClause);
  }
}
class InterBranchTransferQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("interBranchTransfer", []);
  }
}

module.exports = {
  InterBranchTransferQueryCache,
  InterBranchTransferQueryCacheInvalidator,
};
