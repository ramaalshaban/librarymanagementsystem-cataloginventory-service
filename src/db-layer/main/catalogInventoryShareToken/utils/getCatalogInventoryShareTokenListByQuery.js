const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { CatalogInventoryShareToken } = require("models");

const getCatalogInventoryShareTokenListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const catalogInventoryShareToken =
      await CatalogInventoryShareToken.find(query);

    if (!catalogInventoryShareToken || catalogInventoryShareToken.length === 0)
      return [];

    //should i add not found error or only return empty array?
    //      if (!catalogInventoryShareToken || catalogInventoryShareToken.length === 0) {
    //      throw new NotFoundError(
    //      `CatalogInventoryShareToken with the specified criteria not found`
    //  );
    //}

    return catalogInventoryShareToken.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenListByQuery",
      err,
    );
  }
};

module.exports = getCatalogInventoryShareTokenListByQuery;
