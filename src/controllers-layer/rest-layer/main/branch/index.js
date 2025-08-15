const express = require("express");

// Branch Db Object Rest Api Router
const branchRouter = express.Router();

// add Branch controllers

// getBranch controller
branchRouter.get("/branches/:branchId", require("./get-branch"));
// createBranch controller
branchRouter.post("/branches", require("./create-branch"));
// updateBranch controller
branchRouter.patch("/branches/:branchId", require("./update-branch"));
// deleteBranch controller
branchRouter.delete("/branches/:branchId", require("./delete-branch"));
// listBranches controller
branchRouter.get("/branches", require("./list-branches"));

module.exports = branchRouter;
