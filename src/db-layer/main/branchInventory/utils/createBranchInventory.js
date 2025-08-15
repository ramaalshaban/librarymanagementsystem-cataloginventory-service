const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { BranchInventory } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("branchInventory");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "bookId",
    "branchId",
    "totalCopies",
    "availableCopies",
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

const createBranchInventory = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForBranchInventory`);
    }

    validateData(data);

    const newbranchInventory = new BranchInventory(data);
    const createdbranchInventory = await newbranchInventory.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdbranchInventory.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingBranchInventory`, err);
  }
};

module.exports = createBranchInventory;
