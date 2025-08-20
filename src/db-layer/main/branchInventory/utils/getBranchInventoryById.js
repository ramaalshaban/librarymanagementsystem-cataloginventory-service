const { HttpServerError } = require("common");

let { BranchInventory } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getBranchInventoryById = async (branchInventoryId) => {
  try {
    const branchInventory = Array.isArray(branchInventoryId)
      ? await BranchInventory.findAll({
          where: {
            id: { [Op.in]: branchInventoryId },
            isActive: true,
          },
        })
      : await BranchInventory.findOne({
          where: {
            id: branchInventoryId,
            isActive: true,
          },
        });

    if (!branchInventory) {
      return null;
    }
    return Array.isArray(branchInventoryId)
      ? branchInventory.map((item) => item.getData())
      : branchInventory.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryById",
      err,
    );
  }
};

module.exports = getBranchInventoryById;
