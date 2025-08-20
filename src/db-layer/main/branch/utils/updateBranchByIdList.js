const { HttpServerError } = require("common");

const { Branch } = require("models");
const { Op } = require("sequelize");

const updateBranchByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await Branch.update(dataClause, options);
    const branchIdList = rows.map((item) => item.id);
    return branchIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingBranchByIdList", err);
  }
};

module.exports = updateBranchByIdList;
