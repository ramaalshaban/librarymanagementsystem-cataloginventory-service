const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  createCatalogInventoryShareToken: utils.createCatalogInventoryShareToken,
  getIdListOfCatalogInventoryShareTokenByField:
    utils.getIdListOfCatalogInventoryShareTokenByField,
  getCatalogInventoryShareTokenById: utils.getCatalogInventoryShareTokenById,
  getCatalogInventoryShareTokenAggById:
    utils.getCatalogInventoryShareTokenAggById,
  getCatalogInventoryShareTokenListByQuery:
    utils.getCatalogInventoryShareTokenListByQuery,
  getCatalogInventoryShareTokenStatsByQuery:
    utils.getCatalogInventoryShareTokenStatsByQuery,
  getCatalogInventoryShareTokenByQuery:
    utils.getCatalogInventoryShareTokenByQuery,
  updateCatalogInventoryShareTokenById:
    utils.updateCatalogInventoryShareTokenById,
  updateCatalogInventoryShareTokenByIdList:
    utils.updateCatalogInventoryShareTokenByIdList,
  updateCatalogInventoryShareTokenByQuery:
    utils.updateCatalogInventoryShareTokenByQuery,
  deleteCatalogInventoryShareTokenById:
    utils.deleteCatalogInventoryShareTokenById,
  deleteCatalogInventoryShareTokenByQuery:
    utils.deleteCatalogInventoryShareTokenByQuery,
};
