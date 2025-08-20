const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class InterBranchTransferQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("interBranchTransfer", [], Op.and, Op.eq, input, wClause);
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
