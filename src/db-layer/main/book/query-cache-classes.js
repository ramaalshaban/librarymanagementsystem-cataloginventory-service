const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class BookQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("book", [], Op.and, Op.eq, input, wClause);
  }
}
class BookQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("book", []);
  }
}

module.exports = {
  BookQueryCache,
  BookQueryCacheInvalidator,
};
