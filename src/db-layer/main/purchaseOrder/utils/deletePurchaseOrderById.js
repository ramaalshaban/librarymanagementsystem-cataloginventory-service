const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { PurchaseOrder } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const indexDataToElastic = async (id) => {
  const elasticIndexer = new ElasticIndexer("purchaseOrder");
  await elasticIndexer.deleteData(id);
};

const deletePurchaseOrderById = async (id) => {
  try {
    if (typeof id === "object") {
      id = id.id;
    }
    if (!id)
      throw new BadRequestError("ID is required in utility delete function");

    const existingDoc = await PurchaseOrder.findOne({
      _id: id,
      isActive: true,
    });

    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }

    const options = { new: true };
    const dataClause = { isActive: false };

    const deletedDoc = await PurchaseOrder.findOneAndUpdate(
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
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPurchaseOrderById",
      err,
    );
  }
};

module.exports = deletePurchaseOrderById;
