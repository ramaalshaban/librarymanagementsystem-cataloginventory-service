const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { InventoryAuditLog } = require("models");
const { Op } = require("sequelize");

const getIdListOfInventoryAuditLogByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const inventoryAuditLogProperties = [
      "id",
      "branchId",
      "branchInventoryId",
      "auditType",
      "detailNote",
      "adjustmentValue",
      "recordedByUserId",
    ];

    isValidField = inventoryAuditLogProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof InventoryAuditLog[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let inventoryAuditLogIdList = await InventoryAuditLog.findAll(options);

    if (!inventoryAuditLogIdList || inventoryAuditLogIdList.length === 0) {
      throw new NotFoundError(
        `InventoryAuditLog with the specified criteria not found`,
      );
    }

    inventoryAuditLogIdList = inventoryAuditLogIdList.map((item) => item.id);
    return inventoryAuditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfInventoryAuditLogByField;
