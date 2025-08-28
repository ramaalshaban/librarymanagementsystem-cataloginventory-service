const { GetBookManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class GetBookRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("getBook", "getbook", req, res);
    this.dataName = "book";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetBookManager(this._req, "rest");
  }
}

const getBook = async (req, res, next) => {
  const getBookRestController = new GetBookRestController(req, res);
  try {
    await getBookRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getBook;
