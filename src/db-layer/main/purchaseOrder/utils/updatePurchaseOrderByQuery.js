const { HttpServerError, BadRequestError } = require("common");

const { PurchaseOrder } = require("models");
const { Op } = require("sequelize");

const updatePurchaseOrderByQuery = async (dataClause, query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    let rowsCount = null;
    let rows = null;

    const options = { where: { query, isActive: true }, returning: true };

    [rowsCount, rows] = await PurchaseOrder.update(dataClause, options);

    if (!rowsCount) return [];
    return rows.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPurchaseOrderByQuery",
      err,
    );
  }
};

module.exports = updatePurchaseOrderByQuery;
