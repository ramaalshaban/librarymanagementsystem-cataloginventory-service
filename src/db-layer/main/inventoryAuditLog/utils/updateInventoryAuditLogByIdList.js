const { HttpServerError } = require("common");

const { InventoryAuditLog } = require("models");
const { Op } = require("sequelize");

const updateInventoryAuditLogByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await InventoryAuditLog.update(dataClause, options);
    const inventoryAuditLogIdList = rows.map((item) => item.id);
    return inventoryAuditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingInventoryAuditLogByIdList",
      err,
    );
  }
};

module.exports = updateInventoryAuditLogByIdList;
