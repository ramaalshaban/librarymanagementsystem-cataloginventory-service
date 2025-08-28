const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { CatalogInventoryShareToken } = require("models");

const getIdListOfCatalogInventoryShareTokenByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const catalogInventoryShareTokenProperties = [
      "id",
      "configName",
      "objectName",
      "objectId",
      "ownerId",
      "peopleOption",
      "tokenPermissions",
      "allowedEmails",
      "expireDate",
    ];

    if (!catalogInventoryShareTokenProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = CatalogInventoryShareToken.schema.paths[fieldName];
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

    let catalogInventoryShareTokenIdList =
      await CatalogInventoryShareToken.find(query, { _id: 1 }).lean().exec();

    if (
      !catalogInventoryShareTokenIdList ||
      catalogInventoryShareTokenIdList.length === 0
    ) {
      throw new NotFoundError(
        `CatalogInventoryShareToken with the specified criteria not found`,
      );
    }

    catalogInventoryShareTokenIdList = catalogInventoryShareTokenIdList.map(
      (item) => item._id.toString(),
    );

    return catalogInventoryShareTokenIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfCatalogInventoryShareTokenByField;
