const { HttpServerError } = require("common");

const { PurchaseOrder } = require("models");
const { Op } = require("sequelize");

const updatePurchaseOrderByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await PurchaseOrder.update(dataClause, options);
    const purchaseOrderIdList = rows.map((item) => item.id);
    return purchaseOrderIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPurchaseOrderByIdList",
      err,
    );
  }
};

module.exports = updatePurchaseOrderByIdList;
