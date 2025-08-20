const { HttpServerError } = require("common");

let { PurchaseOrder } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getPurchaseOrderById = async (purchaseOrderId) => {
  try {
    const purchaseOrder = Array.isArray(purchaseOrderId)
      ? await PurchaseOrder.findAll({
          where: {
            id: { [Op.in]: purchaseOrderId },
            isActive: true,
          },
        })
      : await PurchaseOrder.findOne({
          where: {
            id: purchaseOrderId,
            isActive: true,
          },
        });

    if (!purchaseOrder) {
      return null;
    }
    return Array.isArray(purchaseOrderId)
      ? purchaseOrder.map((item) => item.getData())
      : purchaseOrder.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderById",
      err,
    );
  }
};

module.exports = getPurchaseOrderById;
