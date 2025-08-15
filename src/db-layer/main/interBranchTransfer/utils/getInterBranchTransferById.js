const { HttpServerError } = require("common");

const { InterBranchTransfer } = require("models");

const getInterBranchTransferById = async (interBranchTransferId) => {
  try {
    let interBranchTransfer;

    if (Array.isArray(interBranchTransferId)) {
      interBranchTransfer = await InterBranchTransfer.find({
        _id: { $in: interBranchTransferId },
        isActive: true,
      });
    } else {
      interBranchTransfer = await InterBranchTransfer.findOne({
        _id: interBranchTransferId,
        isActive: true,
      });
    }

    if (!interBranchTransfer) {
      return null;
    }

    return Array.isArray(interBranchTransferId)
      ? interBranchTransfer.map((item) => item.getData())
      : interBranchTransfer.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferById",
      err,
    );
  }
};

module.exports = getInterBranchTransferById;
