const { HttpServerError } = require("common");

let { InventoryAuditLog } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getInventoryAuditLogById = async (inventoryAuditLogId) => {
  try {
    const inventoryAuditLog = Array.isArray(inventoryAuditLogId)
      ? await InventoryAuditLog.findAll({
          where: {
            id: { [Op.in]: inventoryAuditLogId },
            isActive: true,
          },
        })
      : await InventoryAuditLog.findOne({
          where: {
            id: inventoryAuditLogId,
            isActive: true,
          },
        });

    if (!inventoryAuditLog) {
      return null;
    }
    return Array.isArray(inventoryAuditLogId)
      ? inventoryAuditLog.map((item) => item.getData())
      : inventoryAuditLog.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogById",
      err,
    );
  }
};

module.exports = getInventoryAuditLogById;
