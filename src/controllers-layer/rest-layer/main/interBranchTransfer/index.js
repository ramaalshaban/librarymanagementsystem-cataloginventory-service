const express = require("express");

// InterBranchTransfer Db Object Rest Api Router
const interBranchTransferRouter = express.Router();

// add InterBranchTransfer controllers

// getInterBranchTransfer controller
interBranchTransferRouter.get(
  "/interbranchtransfers/:interBranchTransferId",
  require("./get-interbranchtransfer"),
);
// createInterBranchTransfer controller
interBranchTransferRouter.post(
  "/interbranchtransfers",
  require("./create-interbranchtransfer"),
);
// updateInterBranchTransfer controller
interBranchTransferRouter.patch(
  "/interbranchtransfers/:interBranchTransferId",
  require("./update-interbranchtransfer"),
);
// deleteInterBranchTransfer controller
interBranchTransferRouter.delete(
  "/interbranchtransfers/:interBranchTransferId",
  require("./delete-interbranchtransfer"),
);
// listInterBranchTransfers controller
interBranchTransferRouter.get(
  "/interbranchtransfers",
  require("./list-interbranchtransfers"),
);

module.exports = interBranchTransferRouter;
