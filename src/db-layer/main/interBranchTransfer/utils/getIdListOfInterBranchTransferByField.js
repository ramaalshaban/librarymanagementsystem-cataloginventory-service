const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { InterBranchTransfer } = require("models");

const getIdListOfInterBranchTransferByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const interBranchTransferProperties = [
      "id",
      "bookId",
      "sourceBranchId",
      "destBranchId",
      "quantity",
      "requestedByUserId",
      "status",
      "transferLog",
    ];

    if (!interBranchTransferProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = InterBranchTransfer.schema.paths[fieldName];
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

    let interBranchTransferIdList = await InterBranchTransfer.find(query, {
      _id: 1,
    })
      .lean()
      .exec();

    if (!interBranchTransferIdList || interBranchTransferIdList.length === 0) {
      throw new NotFoundError(
        `InterBranchTransfer with the specified criteria not found`,
      );
    }

    interBranchTransferIdList = interBranchTransferIdList.map((item) =>
      item._id.toString(),
    );

    return interBranchTransferIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfInterBranchTransferByField;
