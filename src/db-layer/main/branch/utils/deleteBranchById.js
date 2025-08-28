const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { Branch } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const indexDataToElastic = async (id) => {
  const elasticIndexer = new ElasticIndexer("branch");
  await elasticIndexer.deleteData(id);
};

const deleteBranchById = async (id) => {
  try {
    if (typeof id === "object") {
      id = id.id;
    }
    if (!id)
      throw new BadRequestError("ID is required in utility delete function");

    const existingDoc = await Branch.findOne({
      _id: id,
      isActive: true,
    });

    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }

    const options = { new: true };
    const dataClause = { isActive: false };

    const deletedDoc = await Branch.findOneAndUpdate(
      { _id: id, isActive: true },
      dataClause,
      options,
    );

    await indexDataToElastic(id);

    return deletedDoc.getData();
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingBranchById", err);
  }
};

module.exports = deleteBranchById;
