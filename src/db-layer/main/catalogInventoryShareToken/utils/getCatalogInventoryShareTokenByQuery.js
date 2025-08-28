const { HttpServerError, BadRequestError } = require("common");

const { CatalogInventoryShareToken } = require("models");

const getCatalogInventoryShareTokenByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const catalogInventoryShareToken = await CatalogInventoryShareToken.findOne(
      {
        ...query,
        isActive: true,
      },
    );

    if (!catalogInventoryShareToken) return null;

    return catalogInventoryShareToken.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenByQuery",
      err,
    );
  }
};

module.exports = getCatalogInventoryShareTokenByQuery;
