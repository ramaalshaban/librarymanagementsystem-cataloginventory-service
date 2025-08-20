const { HttpServerError } = require("common");

const { Branch } = require("models");

const updateBranchByIdList = async (idList, dataClause) => {
  try {
    await Branch.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await Branch.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const branchIdList = updatedDocs.map((doc) => doc._id);

    return branchIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingBranchByIdList", err);
  }
};

module.exports = updateBranchByIdList;
