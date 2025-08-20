const { HttpServerError } = require("common");

let { Branch } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getBranchById = async (branchId) => {
  try {
    const branch = Array.isArray(branchId)
      ? await Branch.findAll({
          where: {
            id: { [Op.in]: branchId },
            isActive: true,
          },
        })
      : await Branch.findOne({
          where: {
            id: branchId,
            isActive: true,
          },
        });

    if (!branch) {
      return null;
    }
    return Array.isArray(branchId)
      ? branch.map((item) => item.getData())
      : branch.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBranchById", err);
  }
};

module.exports = getBranchById;
