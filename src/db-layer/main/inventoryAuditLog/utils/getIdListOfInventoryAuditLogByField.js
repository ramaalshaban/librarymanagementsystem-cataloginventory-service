const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { InventoryAuditLog } = require("models");

const getIdListOfInventoryAuditLogByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const inventoryAuditLogProperties = [
      "id",
      "branchId",
      "branchInventoryId",
      "auditType",
      "detailNote",
      "adjustmentValue",
      "recordedByUserId",
    ];

    if (!inventoryAuditLogProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = InventoryAuditLog.schema.paths[fieldName];
    if (schemaPath && fieldValue !== undefined && fieldValue !== null) {
      const expectedType = schemaPath.instance.toLowerCase();
      const actualType = typeof fieldValue;

      const typeMapping = {
        string: "string",
        number: "number",
        boolean: "boolean",
        objectid: "string", // ObjectIds are typically passed as strings
      };

      const expectedJSType = typeMapping[expectedType];
      if (expectedJSType && actualType !== expectedJSType) {
        throw new BadRequestError(
          `Invalid field value type for ${fieldName}. Expected ${expectedJSType}, got ${actualType}.`,
        );
      }
    }

    let query = isArray
      ? {
          [fieldName]: {
            $in: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          },
        }
      : { [fieldName]: fieldValue };

    query.isActive = true;

    let inventoryAuditLogIdList = await InventoryAuditLog.find(query, {
      _id: 1,
    })
      .lean()
      .exec();

    if (!inventoryAuditLogIdList || inventoryAuditLogIdList.length === 0) {
      throw new NotFoundError(
        `InventoryAuditLog with the specified criteria not found`,
      );
    }

    inventoryAuditLogIdList = inventoryAuditLogIdList.map((item) =>
      item._id.toString(),
    );

    return inventoryAuditLogIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfInventoryAuditLogByField;
