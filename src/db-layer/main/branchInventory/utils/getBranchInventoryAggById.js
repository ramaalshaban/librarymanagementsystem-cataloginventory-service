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

const getBranchInventoryAggById = async (branchInventoryId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const branchInventory = Array.isArray(branchInventoryId)
      ? await BranchInventory.findAll({
          where: {
            id: { [Op.in]: branchInventoryId },
            isActive: true,
          },
          include: includes,
        })
      : await BranchInventory.findOne({
          where: {
            id: branchInventoryId,
            isActive: true,
          },
          include: includes,
        });

    if (!branchInventory) {
      return null;
    }

    const branchInventoryData =
      Array.isArray(branchInventoryId) && branchInventoryId.length > 0
        ? branchInventory.map((item) => item.getData())
        : branchInventory.getData();
    await BranchInventory.getCqrsJoins(branchInventoryData);
    return branchInventoryData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryAggById",
      err,
    );
  }
};

module.exports = getBranchInventoryAggById;
