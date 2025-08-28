const { HttpServerError, BadRequestError } = require("common");

const { Branch } = require("models");

const getBranchByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const branch = await Branch.findOne({
      ...query,
      isActive: true,
    });

    if (!branch) return null;

    return branch.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBranchByQuery", err);
  }
};

module.exports = getBranchByQuery;
