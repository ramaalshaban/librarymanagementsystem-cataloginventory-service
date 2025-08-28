const CatalogInventoryServiceRestController = require("./CatalogInventoryServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new CatalogInventoryServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
