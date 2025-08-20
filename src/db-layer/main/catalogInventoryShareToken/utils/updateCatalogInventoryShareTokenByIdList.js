const { HttpServerError } = require("common");

const { CatalogInventoryShareToken } = require("models");
const { Op } = require("sequelize");

const updateCatalogInventoryShareTokenByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await CatalogInventoryShareToken.update(
      dataClause,
      options,
    );
    const catalogInventoryShareTokenIdList = rows.map((item) => item.id);
    return catalogInventoryShareTokenIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCatalogInventoryShareTokenByIdList",
      err,
    );
  }
};

module.exports = updateCatalogInventoryShareTokenByIdList;
