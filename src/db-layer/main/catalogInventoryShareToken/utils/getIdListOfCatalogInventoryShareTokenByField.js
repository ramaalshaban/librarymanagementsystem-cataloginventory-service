const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { CatalogInventoryShareToken } = require("models");
const { Op } = require("sequelize");

const getIdListOfCatalogInventoryShareTokenByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

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

    isValidField = catalogInventoryShareTokenProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof CatalogInventoryShareToken[fieldName];

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

    let catalogInventoryShareTokenIdList =
      await CatalogInventoryShareToken.findAll(options);

    if (
      !catalogInventoryShareTokenIdList ||
      catalogInventoryShareTokenIdList.length === 0
    ) {
      throw new NotFoundError(
        `CatalogInventoryShareToken with the specified criteria not found`,
      );
    }

    catalogInventoryShareTokenIdList = catalogInventoryShareTokenIdList.map(
      (item) => item.id,
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
