const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetBranch: require("./dbGetBranch"),
  dbCreateBranch: require("./dbCreateBranch"),
  dbUpdateBranch: require("./dbUpdateBranch"),
  dbDeleteBranch: require("./dbDeleteBranch"),
  dbListBranches: require("./dbListBranches"),
  createBranch: utils.createBranch,
  getIdListOfBranchByField: utils.getIdListOfBranchByField,
  getBranchById: utils.getBranchById,
  getBranchAggById: utils.getBranchAggById,
  getBranchListByQuery: utils.getBranchListByQuery,
  getBranchStatsByQuery: utils.getBranchStatsByQuery,
  getBranchByQuery: utils.getBranchByQuery,
  updateBranchById: utils.updateBranchById,
  updateBranchByIdList: utils.updateBranchByIdList,
  updateBranchByQuery: utils.updateBranchByQuery,
  deleteBranchById: utils.deleteBranchById,
  deleteBranchByQuery: utils.deleteBranchByQuery,
};
