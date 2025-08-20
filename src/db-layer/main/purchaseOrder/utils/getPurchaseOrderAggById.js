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

const getPurchaseOrderAggById = async (purchaseOrderId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const purchaseOrder = Array.isArray(purchaseOrderId)
      ? await PurchaseOrder.findAll({
          where: {
            id: { [Op.in]: purchaseOrderId },
            isActive: true,
          },
          include: includes,
        })
      : await PurchaseOrder.findOne({
          where: {
            id: purchaseOrderId,
            isActive: true,
          },
          include: includes,
        });

    if (!purchaseOrder) {
      return null;
    }

    const purchaseOrderData =
      Array.isArray(purchaseOrderId) && purchaseOrderId.length > 0
        ? purchaseOrder.map((item) => item.getData())
        : purchaseOrder.getData();
    await PurchaseOrder.getCqrsJoins(purchaseOrderData);
    return purchaseOrderData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderAggById",
      err,
    );
  }
};

module.exports = getPurchaseOrderAggById;
