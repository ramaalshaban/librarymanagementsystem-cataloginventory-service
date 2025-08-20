const { HttpServerError } = require("common");

const { BranchInventory } = require("models");

const updateBranchInventoryByIdList = async (idList, dataClause) => {
  try {
    await BranchInventory.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await BranchInventory.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const branchInventoryIdList = updatedDocs.map((doc) => doc._id);

    return branchInventoryIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingBranchInventoryByIdList",
      err,
    );
  }
};

module.exports = updateBranchInventoryByIdList;
