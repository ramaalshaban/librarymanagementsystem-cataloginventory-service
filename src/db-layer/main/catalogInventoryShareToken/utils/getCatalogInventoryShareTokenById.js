const { HttpServerError } = require("common");

const { CatalogInventoryShareToken } = require("models");

const getCatalogInventoryShareTokenById = async (
  catalogInventoryShareTokenId,
) => {
  try {
    let catalogInventoryShareToken;

    if (Array.isArray(catalogInventoryShareTokenId)) {
      catalogInventoryShareToken = await CatalogInventoryShareToken.find({
        _id: { $in: catalogInventoryShareTokenId },
        isActive: true,
      });
    } else {
      catalogInventoryShareToken = await CatalogInventoryShareToken.findOne({
        _id: catalogInventoryShareTokenId,
        isActive: true,
      });
    }

    if (!catalogInventoryShareToken) {
      return null;
    }

    return Array.isArray(catalogInventoryShareTokenId)
      ? catalogInventoryShareToken.map((item) => item.getData())
      : catalogInventoryShareToken.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenById",
      err,
    );
  }
};

module.exports = getCatalogInventoryShareTokenById;
