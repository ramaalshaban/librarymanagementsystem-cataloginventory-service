module.exports = (headers) => {
  // BranchInventory Db Object Rest Api Router
  const branchInventoryMcpRouter = [];
  // getBranchInventory controller
  branchInventoryMcpRouter.push(require("./get-branchinventory")(headers));
  // createBranchInventory controller
  branchInventoryMcpRouter.push(require("./create-branchinventory")(headers));
  // updateBranchInventory controller
  branchInventoryMcpRouter.push(require("./update-branchinventory")(headers));
  // deleteBranchInventory controller
  branchInventoryMcpRouter.push(require("./delete-branchinventory")(headers));
  // listBranchInventories controller
  branchInventoryMcpRouter.push(require("./list-branchinventories")(headers));
  return branchInventoryMcpRouter;
};
