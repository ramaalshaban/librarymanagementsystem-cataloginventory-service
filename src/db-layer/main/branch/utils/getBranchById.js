const { HttpServerError } = require("common");

const { Branch } = require("models");

const getBranchById = async (branchId) => {
  try {
    let branch;

    if (Array.isArray(branchId)) {
      branch = await Branch.find({
        _id: { $in: branchId },
        isActive: true,
      });
    } else {
      branch = await Branch.findOne({
        _id: branchId,
        isActive: true,
      });
    }

    if (!branch) {
      return null;
    }

    return Array.isArray(branchId)
      ? branch.map((item) => item.getData())
      : branch.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBranchById", err);
  }
};

module.exports = getBranchById;
