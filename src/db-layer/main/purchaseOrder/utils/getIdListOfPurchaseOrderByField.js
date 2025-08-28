const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { PurchaseOrder } = require("models");

const getIdListOfPurchaseOrderByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const purchaseOrderProperties = [
      "id",
      "branchId",
      "requestedByUserId",
      "itemRequests",
      "status",
      "approvalNotes",
    ];

    if (!purchaseOrderProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = PurchaseOrder.schema.paths[fieldName];
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

    let purchaseOrderIdList = await PurchaseOrder.find(query, { _id: 1 })
      .lean()
      .exec();

    if (!purchaseOrderIdList || purchaseOrderIdList.length === 0) {
      throw new NotFoundError(
        `PurchaseOrder with the specified criteria not found`,
      );
    }

    purchaseOrderIdList = purchaseOrderIdList.map((item) =>
      item._id.toString(),
    );

    return purchaseOrderIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPurchaseOrderByField;
