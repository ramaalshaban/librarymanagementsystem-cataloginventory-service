const { HttpServerError } = require("common");

const { InterBranchTransfer } = require("models");
const { Op } = require("sequelize");

const updateInterBranchTransferByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await InterBranchTransfer.update(dataClause, options);
    const interBranchTransferIdList = rows.map((item) => item.id);
    return interBranchTransferIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingInterBranchTransferByIdList",
      err,
    );
  }
};

module.exports = updateInterBranchTransferByIdList;
