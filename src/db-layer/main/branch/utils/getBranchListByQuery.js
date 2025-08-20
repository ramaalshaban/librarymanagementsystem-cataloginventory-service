const { HttpServerError, BadRequestError } = require("common");

const { Branch } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getBranchListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const branch = await Branch.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!branch || branch.length === 0) return [];

    //      if (!branch || branch.length === 0) {
    //      throw new NotFoundError(
    //      `Branch with the specified criteria not found`
    //  );
    //}

    return branch.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchListByQuery",
      err,
    );
  }
};

module.exports = getBranchListByQuery;
