const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { PurchaseOrder } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("purchaseOrder");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "branchId",
    "requestedByUserId",
    "itemRequests",
    "status",
    "isActive",
  ];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data._id && !data.id) {
    data._id = newUUID();
  }
};

const createPurchaseOrder = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForPurchaseOrder`);
    }

    validateData(data);

    const newpurchaseOrder = new PurchaseOrder(data);
    const createdpurchaseOrder = await newpurchaseOrder.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdpurchaseOrder.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingPurchaseOrder`, err);
  }
};

module.exports = createPurchaseOrder;
