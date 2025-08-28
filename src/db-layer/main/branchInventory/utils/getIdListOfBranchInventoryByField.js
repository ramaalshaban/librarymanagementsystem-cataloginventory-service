const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { BranchInventory } = require("models");

const getIdListOfBranchInventoryByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const branchInventoryProperties = [
      "id",
      "bookId",
      "branchId",
      "totalCopies",
      "availableCopies",
      "localShelfLocation",
      "conditionNotes",
    ];

    if (!branchInventoryProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = BranchInventory.schema.paths[fieldName];
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

    let branchInventoryIdList = await BranchInventory.find(query, { _id: 1 })
      .lean()
      .exec();

    if (!branchInventoryIdList || branchInventoryIdList.length === 0) {
      throw new NotFoundError(
        `BranchInventory with the specified criteria not found`,
      );
    }

    branchInventoryIdList = branchInventoryIdList.map((item) =>
      item._id.toString(),
    );

    return branchInventoryIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfBranchInventoryByField;
