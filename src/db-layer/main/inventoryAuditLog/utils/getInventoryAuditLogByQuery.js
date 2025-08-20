const { HttpServerError, BadRequestError } = require("common");

const { InventoryAuditLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getInventoryAuditLogByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const inventoryAuditLog = await InventoryAuditLog.findOne({
      where: { ...query, isActive: true },
    });

    if (!inventoryAuditLog) return null;
    return inventoryAuditLog.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogByQuery",
      err,
    );
  }
};

module.exports = getInventoryAuditLogByQuery;
