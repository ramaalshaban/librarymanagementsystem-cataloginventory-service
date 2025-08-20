const { QueryCache, QueryCacheInvalidator } = require("common");

class BookQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("book", [], "$and", "$eq", input, wClause);
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
