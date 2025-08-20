const { HttpServerError, BadRequestError } = require("common");

const { InventoryAuditLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getInventoryAuditLogListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const inventoryAuditLog = await InventoryAuditLog.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!inventoryAuditLog || inventoryAuditLog.length === 0) return [];

    //      if (!inventoryAuditLog || inventoryAuditLog.length === 0) {
    //      throw new NotFoundError(
    //      `InventoryAuditLog with the specified criteria not found`
    //  );
    //}

    return inventoryAuditLog.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogListByQuery",
      err,
    );
  }
};

module.exports = getInventoryAuditLogListByQuery;
