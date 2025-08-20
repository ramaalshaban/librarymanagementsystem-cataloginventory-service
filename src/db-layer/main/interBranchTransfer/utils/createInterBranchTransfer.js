const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { InterBranchTransfer } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("interBranchTransfer");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "bookId",
    "sourceBranchId",
    "destBranchId",
    "quantity",
    "requestedByUserId",
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

const createInterBranchTransfer = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(
        `errMsg_invalidInputDataForInterBranchTransfer`,
      );
    }

    validateData(data);

    const newinterBranchTransfer = new InterBranchTransfer(data);
    const createdinterBranchTransfer = await newinterBranchTransfer.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdinterBranchTransfer.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(
      `errMsg_dbErrorWhenCreatingInterBranchTransfer`,
      err,
    );
  }
};

module.exports = createInterBranchTransfer;
