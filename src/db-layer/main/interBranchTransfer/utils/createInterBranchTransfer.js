const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { InterBranchTransfer } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "interBranchTransfer",
    this.session,
    this.requestId,
  );
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
  ];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createInterBranchTransfer = async (data) => {
  try {
    validateData(data);

    const newinterBranchTransfer = await InterBranchTransfer.create(data);
    const _data = newinterBranchTransfer.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenCreatingInterBranchTransfer",
      err,
    );
  }
};

module.exports = createInterBranchTransfer;
