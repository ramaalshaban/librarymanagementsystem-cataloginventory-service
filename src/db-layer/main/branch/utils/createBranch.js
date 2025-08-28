const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { Branch } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("branch");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["name", "isActive"];

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

const createBranch = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForBranch`);
    }

    validateData(data);

    const newbranch = new Branch(data);
    const createdbranch = await newbranch.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdbranch.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingBranch`, err);
  }
};

module.exports = createBranch;
