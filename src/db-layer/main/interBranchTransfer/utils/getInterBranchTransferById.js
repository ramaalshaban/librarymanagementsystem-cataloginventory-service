const { HttpServerError } = require("common");

let { InterBranchTransfer } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getInterBranchTransferById = async (interBranchTransferId) => {
  try {
    const interBranchTransfer = Array.isArray(interBranchTransferId)
      ? await InterBranchTransfer.findAll({
          where: {
            id: { [Op.in]: interBranchTransferId },
            isActive: true,
          },
        })
      : await InterBranchTransfer.findOne({
          where: {
            id: interBranchTransferId,
            isActive: true,
          },
        });

    if (!interBranchTransfer) {
      return null;
    }
    return Array.isArray(interBranchTransferId)
      ? interBranchTransfer.map((item) => item.getData())
      : interBranchTransfer.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferById",
      err,
    );
  }
};

module.exports = getInterBranchTransferById;
