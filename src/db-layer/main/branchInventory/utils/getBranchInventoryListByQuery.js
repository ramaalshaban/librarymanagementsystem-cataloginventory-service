const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { BranchInventory } = require("models");

const getBranchInventoryListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const branchInventory = await BranchInventory.find(query);

    if (!branchInventory || branchInventory.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!branchInventory || branchInventory.length === 0) {
    //      throw new NotFoundError(
    //      `BranchInventory with the specified criteria not found`
    //  );
    //}

    return branchInventory.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryListByQuery",
      err,
    );
  }
};

module.exports = getBranchInventoryListByQuery;
