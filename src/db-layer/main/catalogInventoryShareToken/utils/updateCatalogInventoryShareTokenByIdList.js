const { HttpServerError } = require("common");

const { CatalogInventoryShareToken } = require("models");

const updateCatalogInventoryShareTokenByIdList = async (idList, dataClause) => {
  try {
    await CatalogInventoryShareToken.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await CatalogInventoryShareToken.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const catalogInventoryShareTokenIdList = updatedDocs.map((doc) => doc._id);

    return catalogInventoryShareTokenIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingCatalogInventoryShareTokenByIdList",
      err,
    );
  }
};

module.exports = updateCatalogInventoryShareTokenByIdList;
