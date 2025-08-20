const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  Book,
  Branch,
  BranchInventory,
  InventoryAuditLog,
  InterBranchTransfer,
  PurchaseOrder,
  CatalogInventoryShareToken,
} = require("models");
const { Op } = require("sequelize");

const getInventoryAuditLogAggById = async (inventoryAuditLogId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const inventoryAuditLog = Array.isArray(inventoryAuditLogId)
      ? await InventoryAuditLog.findAll({
          where: {
            id: { [Op.in]: inventoryAuditLogId },
            isActive: true,
          },
          include: includes,
        })
      : await InventoryAuditLog.findOne({
          where: {
            id: inventoryAuditLogId,
            isActive: true,
          },
          include: includes,
        });

    if (!inventoryAuditLog) {
      return null;
    }

    const inventoryAuditLogData =
      Array.isArray(inventoryAuditLogId) && inventoryAuditLogId.length > 0
        ? inventoryAuditLog.map((item) => item.getData())
        : inventoryAuditLog.getData();
    await InventoryAuditLog.getCqrsJoins(inventoryAuditLogData);
    return inventoryAuditLogData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogAggById",
      err,
    );
  }
};

module.exports = getInventoryAuditLogAggById;
