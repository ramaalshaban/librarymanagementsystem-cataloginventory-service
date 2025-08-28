const { HttpServerError } = require("common");

const { PurchaseOrder } = require("models");

const getPurchaseOrderById = async (purchaseOrderId) => {
  try {
    let purchaseOrder;

    if (Array.isArray(purchaseOrderId)) {
      purchaseOrder = await PurchaseOrder.find({
        _id: { $in: purchaseOrderId },
        isActive: true,
      });
    } else {
      purchaseOrder = await PurchaseOrder.findOne({
        _id: purchaseOrderId,
        isActive: true,
      });
    }

    if (!purchaseOrder) {
      return null;
    }

    return Array.isArray(purchaseOrderId)
      ? purchaseOrder.map((item) => item.getData())
      : purchaseOrder.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderById",
      err,
    );
  }
};

module.exports = getPurchaseOrderById;
