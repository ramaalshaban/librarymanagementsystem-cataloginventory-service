const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Book,
  Branch,
  BranchInventory,
  InventoryAuditLog,
  InterBranchTransfer,
  PurchaseOrder,
  CatalogInventoryShareToken,
} = require("models");
const { Op } = require("sequelize");

const getCatalogInventoryShareTokenAggById = async (
  catalogInventoryShareTokenId,
) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const catalogInventoryShareToken = Array.isArray(
      catalogInventoryShareTokenId,
    )
      ? await CatalogInventoryShareToken.findAll({
          where: {
            id: { [Op.in]: catalogInventoryShareTokenId },
            isActive: true,
          },
          include: includes,
        })
      : await CatalogInventoryShareToken.findOne({
          where: {
            id: catalogInventoryShareTokenId,
            isActive: true,
          },
          include: includes,
        });

    if (!catalogInventoryShareToken) {
      return null;
    }

    const catalogInventoryShareTokenData =
      Array.isArray(catalogInventoryShareTokenId) &&
      catalogInventoryShareTokenId.length > 0
        ? catalogInventoryShareToken.map((item) => item.getData())
        : catalogInventoryShareToken.getData();
    await CatalogInventoryShareToken.getCqrsJoins(
      catalogInventoryShareTokenData,
    );
    return catalogInventoryShareTokenData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenAggById",
      err,
    );
  }
};

module.exports = getCatalogInventoryShareTokenAggById;
