const { CreateBookManager } = require("managers");

const CatalogInventoryRestController = require("../../CatalogInventoryServiceRestController");

class CreateBookRestController extends CatalogInventoryRestController {
  constructor(req, res) {
    super("createBook", "createbook", req, res);
    this.dataName = "book";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateBookManager(this._req, "rest");
  }
}

const createBook = async (req, res, next) => {
  const createBookRestController = new CreateBookRestController(req, res);
  try {
    await createBookRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createBook;
