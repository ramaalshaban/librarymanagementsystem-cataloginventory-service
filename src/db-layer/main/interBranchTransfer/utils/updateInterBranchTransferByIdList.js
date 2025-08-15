const { HttpServerError } = require("common");

const { InterBranchTransfer } = require("models");

const updateInterBranchTransferByIdList = async (idList, dataClause) => {
  try {
    await InterBranchTransfer.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await InterBranchTransfer.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const interBranchTransferIdList = updatedDocs.map((doc) => doc._id);

    return interBranchTransferIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingInterBranchTransferByIdList",
      err,
    );
  }
};

module.exports = updateInterBranchTransferByIdList;
