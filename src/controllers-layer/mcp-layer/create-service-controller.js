const CatalogInventoryServiceMcpController = require("./CatalogInventoryServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new CatalogInventoryServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
