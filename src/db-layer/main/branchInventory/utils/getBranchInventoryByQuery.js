const { HttpServerError, BadRequestError } = require("common");

const { BranchInventory } = require("models");

const getBranchInventoryByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const branchInventory = await BranchInventory.findOne({
      ...query,
      isActive: true,
    });

    if (!branchInventory) return null;

    return branchInventory.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryByQuery",
      err,
    );
  }
};

module.exports = getBranchInventoryByQuery;
