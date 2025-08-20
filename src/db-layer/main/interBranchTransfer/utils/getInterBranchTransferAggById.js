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

const getInterBranchTransferAggById = async (interBranchTransferId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const interBranchTransfer = Array.isArray(interBranchTransferId)
      ? await InterBranchTransfer.findAll({
          where: {
            id: { [Op.in]: interBranchTransferId },
            isActive: true,
          },
          include: includes,
        })
      : await InterBranchTransfer.findOne({
          where: {
            id: interBranchTransferId,
            isActive: true,
          },
          include: includes,
        });

    if (!interBranchTransfer) {
      return null;
    }

    const interBranchTransferData =
      Array.isArray(interBranchTransferId) && interBranchTransferId.length > 0
        ? interBranchTransfer.map((item) => item.getData())
        : interBranchTransfer.getData();
    await InterBranchTransfer.getCqrsJoins(interBranchTransferData);
    return interBranchTransferData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferAggById",
      err,
    );
  }
};

module.exports = getInterBranchTransferAggById;
