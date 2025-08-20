const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { InterBranchTransfer } = require("models");
const { Op } = require("sequelize");

const getIdListOfInterBranchTransferByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

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

    isValidField = interBranchTransferProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof InterBranchTransfer[fieldName];

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

    let interBranchTransferIdList = await InterBranchTransfer.findAll(options);

    if (!interBranchTransferIdList || interBranchTransferIdList.length === 0) {
      throw new NotFoundError(
        `InterBranchTransfer with the specified criteria not found`,
      );
    }

    interBranchTransferIdList = interBranchTransferIdList.map(
      (item) => item.id,
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
