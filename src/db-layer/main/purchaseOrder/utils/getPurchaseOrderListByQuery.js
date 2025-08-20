const { HttpServerError, BadRequestError } = require("common");

const { PurchaseOrder } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPurchaseOrderListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const purchaseOrder = await PurchaseOrder.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!purchaseOrder || purchaseOrder.length === 0) return [];

    //      if (!purchaseOrder || purchaseOrder.length === 0) {
    //      throw new NotFoundError(
    //      `PurchaseOrder with the specified criteria not found`
    //  );
    //}

    return purchaseOrder.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderListByQuery",
      err,
    );
  }
};

module.exports = getPurchaseOrderListByQuery;
