const { HttpServerError } = require("common");

const { PurchaseOrder } = require("models");

const updatePurchaseOrderByIdList = async (idList, dataClause) => {
  try {
    await PurchaseOrder.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await PurchaseOrder.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const purchaseOrderIdList = updatedDocs.map((doc) => doc._id);

    return purchaseOrderIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPurchaseOrderByIdList",
      err,
    );
  }
};

module.exports = updatePurchaseOrderByIdList;
