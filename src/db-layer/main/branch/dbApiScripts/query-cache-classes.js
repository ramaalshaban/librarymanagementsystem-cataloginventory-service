const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class BranchQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("branch", [], Op.and, Op.eq, input, wClause);
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
