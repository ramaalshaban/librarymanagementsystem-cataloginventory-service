const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { BranchInventory } = require("models");
const { Op } = require("sequelize");

const getIdListOfBranchInventoryByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const branchInventoryProperties = [
      "id",
      "bookId",
      "branchId",
      "totalCopies",
      "availableCopies",
      "localShelfLocation",
      "conditionNotes",
    ];

    isValidField = branchInventoryProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof BranchInventory[fieldName];

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

    let branchInventoryIdList = await BranchInventory.findAll(options);

    if (!branchInventoryIdList || branchInventoryIdList.length === 0) {
      throw new NotFoundError(
        `BranchInventory with the specified criteria not found`,
      );
    }

    branchInventoryIdList = branchInventoryIdList.map((item) => item.id);
    return branchInventoryIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfBranchInventoryByField;
