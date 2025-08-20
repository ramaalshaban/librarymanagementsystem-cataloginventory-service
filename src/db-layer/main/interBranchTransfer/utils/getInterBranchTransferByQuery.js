const { HttpServerError, BadRequestError } = require("common");

const { InterBranchTransfer } = require("models");

const getInterBranchTransferByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const interBranchTransfer = await InterBranchTransfer.findOne({
      ...query,
      isActive: true,
    });

    if (!interBranchTransfer) return null;

    return interBranchTransfer.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferByQuery",
      err,
    );
  }
};

module.exports = getInterBranchTransferByQuery;
