const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  CatalogInventoryServiceRestController: require("./CatalogInventoryServiceRestController"),
  ...sessionRouter,
};
