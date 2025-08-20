const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { PurchaseOrder } = require("models");
const { Op } = require("sequelize");

const getIdListOfPurchaseOrderByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const purchaseOrderProperties = [
      "id",
      "branchId",
      "requestedByUserId",
      "itemRequests",
      "status",
      "approvalNotes",
    ];

    isValidField = purchaseOrderProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof PurchaseOrder[fieldName];

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

    let purchaseOrderIdList = await PurchaseOrder.findAll(options);

    if (!purchaseOrderIdList || purchaseOrderIdList.length === 0) {
      throw new NotFoundError(
        `PurchaseOrder with the specified criteria not found`,
      );
    }

    purchaseOrderIdList = purchaseOrderIdList.map((item) => item.id);
    return purchaseOrderIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPurchaseOrderByField;
