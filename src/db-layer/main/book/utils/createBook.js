const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { Book } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("book");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["title", "authors", "isActive"];

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

const createBook = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForBook`);
    }

    validateData(data);

    const newbook = new Book(data);
    const createdbook = await newbook.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdbook.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingBook`, err);
  }
};

module.exports = createBook;
