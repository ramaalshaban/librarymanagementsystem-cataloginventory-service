const { HttpServerError } = require("common");

const { BranchInventory } = require("models");
const { Op } = require("sequelize");

const updateBranchInventoryByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await BranchInventory.update(dataClause, options);
    const branchInventoryIdList = rows.map((item) => item.id);
    return branchInventoryIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingBranchInventoryByIdList",
      err,
    );
  }
};

module.exports = updateBranchInventoryByIdList;
