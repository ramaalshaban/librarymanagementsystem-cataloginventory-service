const { ListBooksManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class ListBooksRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("listBooks", "listbooks", req, res);
    this.dataName = "books";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListBooksManager(this._req, "rest");
  }
}

const listBooks = async (req, res, next) => {
  const listBooksRestController = new ListBooksRestController(req, res);
  try {
    await listBooksRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listBooks;
