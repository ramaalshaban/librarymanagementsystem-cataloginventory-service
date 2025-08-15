const { HttpServerError, BadRequestError } = require("common");

const { PurchaseOrder } = require("models");

const getPurchaseOrderByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const purchaseOrder = await PurchaseOrder.findOne({
      ...query,
      isActive: true,
    });

    if (!purchaseOrder) return null;

    return purchaseOrder.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderByQuery",
      err,
    );
  }
};

module.exports = getPurchaseOrderByQuery;
