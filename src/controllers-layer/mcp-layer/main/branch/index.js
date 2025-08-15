module.exports = (headers) => {
  // Branch Db Object Rest Api Router
  const branchMcpRouter = [];
  // getBranch controller
  branchMcpRouter.push(require("./get-branch")(headers));
  // createBranch controller
  branchMcpRouter.push(require("./create-branch")(headers));
  // updateBranch controller
  branchMcpRouter.push(require("./update-branch")(headers));
  // deleteBranch controller
  branchMcpRouter.push(require("./delete-branch")(headers));
  // listBranches controller
  branchMcpRouter.push(require("./list-branches")(headers));
  return branchMcpRouter;
};
