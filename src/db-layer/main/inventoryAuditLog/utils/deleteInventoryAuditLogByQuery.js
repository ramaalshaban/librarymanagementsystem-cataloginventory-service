const { HttpServerError, BadRequestError } = require("common");

const { InventoryAuditLog } = require("models");

const deleteInventoryAuditLogByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    // sholuld i match the resul returned with sequlize?

    const docs = await InventoryAuditLog.find({ ...query, isActive: true });
    if (!docs || docs.length === 0) return [];

    await InventoryAuditLog.updateMany(
      { ...query, isActive: true },
      { isActive: false, updatedAt: new Date() },
    );
    return docs.map((doc) => doc.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenDeletingInventoryAuditLogByQuery",
      err,
    );
  }
};

module.exports = deleteInventoryAuditLogByQuery;
