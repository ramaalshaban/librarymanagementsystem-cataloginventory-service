const { HttpServerError, BadRequestError } = require("common");

const { InterBranchTransfer } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getInterBranchTransferListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const interBranchTransfer = await InterBranchTransfer.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!interBranchTransfer || interBranchTransfer.length === 0) return [];

    //      if (!interBranchTransfer || interBranchTransfer.length === 0) {
    //      throw new NotFoundError(
    //      `InterBranchTransfer with the specified criteria not found`
    //  );
    //}

    return interBranchTransfer.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferListByQuery",
      err,
    );
  }
};

module.exports = getInterBranchTransferListByQuery;
