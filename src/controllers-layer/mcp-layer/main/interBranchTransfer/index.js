module.exports = (headers) => {
  // InterBranchTransfer Db Object Rest Api Router
  const interBranchTransferMcpRouter = [];
  // getInterBranchTransfer controller
  interBranchTransferMcpRouter.push(
    require("./get-interbranchtransfer")(headers),
  );
  // createInterBranchTransfer controller
  interBranchTransferMcpRouter.push(
    require("./create-interbranchtransfer")(headers),
  );
  // updateInterBranchTransfer controller
  interBranchTransferMcpRouter.push(
    require("./update-interbranchtransfer")(headers),
  );
  // deleteInterBranchTransfer controller
  interBranchTransferMcpRouter.push(
    require("./delete-interbranchtransfer")(headers),
  );
  // listInterBranchTransfers controller
  interBranchTransferMcpRouter.push(
    require("./list-interbranchtransfers")(headers),
  );
  return interBranchTransferMcpRouter;
};
