const { HttpServerError } = require("common");

const { InventoryAuditLog } = require("models");

const getInventoryAuditLogById = async (inventoryAuditLogId) => {
  try {
    let inventoryAuditLog;

    if (Array.isArray(inventoryAuditLogId)) {
      inventoryAuditLog = await InventoryAuditLog.find({
        _id: { $in: inventoryAuditLogId },
        isActive: true,
      });
    } else {
      inventoryAuditLog = await InventoryAuditLog.findOne({
        _id: inventoryAuditLogId,
        isActive: true,
      });
    }

    if (!inventoryAuditLog) {
      return null;
    }

    return Array.isArray(inventoryAuditLogId)
      ? inventoryAuditLog.map((item) => item.getData())
      : inventoryAuditLog.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogById",
      err,
    );
  }
};

module.exports = getInventoryAuditLogById;
