const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { InventoryAuditLog } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("inventoryAuditLog");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "branchId",
    "branchInventoryId",
    "auditType",
    "recordedByUserId",
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

const createInventoryAuditLog = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForInventoryAuditLog`);
    }

    validateData(data);

    const newinventoryAuditLog = new InventoryAuditLog(data);
    const createdinventoryAuditLog = await newinventoryAuditLog.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdinventoryAuditLog.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(
      `errMsg_dbErrorWhenCreatingInventoryAuditLog`,
      err,
    );
  }
};

module.exports = createInventoryAuditLog;
