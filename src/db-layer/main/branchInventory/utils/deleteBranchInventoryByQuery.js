const { HttpServerError, BadRequestError } = require("common");

const { BranchInventory } = require("models");

const deleteBranchInventoryByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    // sholuld i match the resul returned with sequlize?

    const docs = await BranchInventory.find({ ...query, isActive: true });
    if (!docs || docs.length === 0) return [];

    await BranchInventory.updateMany(
      { ...query, isActive: true },
      { isActive: false, updatedAt: new Date() },
    );
    return docs.map((doc) => doc.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenDeletingBranchInventoryByQuery",
      err,
    );
  }
};

module.exports = deleteBranchInventoryByQuery;
