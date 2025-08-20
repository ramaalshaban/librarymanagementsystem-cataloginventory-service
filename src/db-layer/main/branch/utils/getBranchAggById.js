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

const getBranchAggById = async (branchId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const branch = Array.isArray(branchId)
      ? await Branch.findAll({
          where: {
            id: { [Op.in]: branchId },
            isActive: true,
          },
          include: includes,
        })
      : await Branch.findOne({
          where: {
            id: branchId,
            isActive: true,
          },
          include: includes,
        });

    if (!branch) {
      return null;
    }

    const branchData =
      Array.isArray(branchId) && branchId.length > 0
        ? branch.map((item) => item.getData())
        : branch.getData();
    await Branch.getCqrsJoins(branchData);
    return branchData;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBranchAggById", err);
  }
};

module.exports = getBranchAggById;
