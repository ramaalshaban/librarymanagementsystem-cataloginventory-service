const { HttpServerError } = require("common");

const { InventoryAuditLog } = require("models");

const updateInventoryAuditLogByIdList = async (idList, dataClause) => {
  try {
    await InventoryAuditLog.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await InventoryAuditLog.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const inventoryAuditLogIdList = updatedDocs.map((doc) => doc._id);

    return inventoryAuditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingInventoryAuditLogByIdList",
      err,
    );
  }
};

module.exports = updateInventoryAuditLogByIdList;
