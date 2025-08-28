const { UpdateBookManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class UpdateBookRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("updateBook", "updatebook", req, res);
    this.dataName = "book";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateBookManager(this._req, "rest");
  }
}

const updateBook = async (req, res, next) => {
  const updateBookRestController = new UpdateBookRestController(req, res);
  try {
    await updateBookRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateBook;
