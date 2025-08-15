const { HttpServerError } = require("common");

const { BranchInventory } = require("models");

const getBranchInventoryById = async (branchInventoryId) => {
  try {
    let branchInventory;

    if (Array.isArray(branchInventoryId)) {
      branchInventory = await BranchInventory.find({
        _id: { $in: branchInventoryId },
        isActive: true,
      });
    } else {
      branchInventory = await BranchInventory.findOne({
        _id: branchInventoryId,
        isActive: true,
      });
    }

    if (!branchInventory) {
      return null;
    }

    return Array.isArray(branchInventoryId)
      ? branchInventory.map((item) => item.getData())
      : branchInventory.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryById",
      err,
    );
  }
};

module.exports = getBranchInventoryById;
