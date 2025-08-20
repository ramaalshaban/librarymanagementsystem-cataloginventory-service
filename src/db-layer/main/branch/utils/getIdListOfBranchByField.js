const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Branch } = require("models");
const { Op } = require("sequelize");

const getIdListOfBranchByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const branchProperties = [
      "id",
      "name",
      "address",
      "geoLocation",
      "contactEmail",
    ];

    isValidField = branchProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Branch[fieldName];

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

    let branchIdList = await Branch.findAll(options);

    if (!branchIdList || branchIdList.length === 0) {
      throw new NotFoundError(`Branch with the specified criteria not found`);
    }

    branchIdList = branchIdList.map((item) => item.id);
    return branchIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfBranchByField;
