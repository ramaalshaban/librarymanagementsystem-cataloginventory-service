const express = require("express");

// BranchInventory Db Object Rest Api Router
const branchInventoryRouter = express.Router();

// add BranchInventory controllers

// getBranchInventory controller
branchInventoryRouter.get(
  "/branchinventories/:branchInventoryId",
  require("./get-branchinventory"),
);
// createBranchInventory controller
branchInventoryRouter.post(
  "/branchinventories",
  require("./create-branchinventory"),
);
// updateBranchInventory controller
branchInventoryRouter.patch(
  "/branchinventories/:branchInventoryId",
  require("./update-branchinventory"),
);
// deleteBranchInventory controller
branchInventoryRouter.delete(
  "/branchinventories/:branchInventoryId",
  require("./delete-branchinventory"),
);
// listBranchInventories controller
branchInventoryRouter.get(
  "/branchinventories",
  require("./list-branchinventories"),
);

module.exports = branchInventoryRouter;
