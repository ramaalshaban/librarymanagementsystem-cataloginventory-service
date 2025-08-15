const { DeleteBookManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class DeleteBookRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("deleteBook", "deletebook", req, res);
    this.dataName = "book";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteBookManager(this._req, "rest");
  }
}

const deleteBook = async (req, res, next) => {
  const deleteBookRestController = new DeleteBookRestController(req, res);
  try {
    await deleteBookRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteBook;
