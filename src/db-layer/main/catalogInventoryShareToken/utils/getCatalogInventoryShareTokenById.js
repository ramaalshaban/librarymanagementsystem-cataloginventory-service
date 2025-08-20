const { HttpServerError } = require("common");

let { CatalogInventoryShareToken } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getCatalogInventoryShareTokenById = async (
  catalogInventoryShareTokenId,
) => {
  try {
    const catalogInventoryShareToken = Array.isArray(
      catalogInventoryShareTokenId,
    )
      ? await CatalogInventoryShareToken.findAll({
          where: {
            id: { [Op.in]: catalogInventoryShareTokenId },
            isActive: true,
          },
        })
      : await CatalogInventoryShareToken.findOne({
          where: {
            id: catalogInventoryShareTokenId,
            isActive: true,
          },
        });

    if (!catalogInventoryShareToken) {
      return null;
    }
    return Array.isArray(catalogInventoryShareTokenId)
      ? catalogInventoryShareToken.map((item) => item.getData())
      : catalogInventoryShareToken.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenById",
      err,
    );
  }
};

module.exports = getCatalogInventoryShareTokenById;
