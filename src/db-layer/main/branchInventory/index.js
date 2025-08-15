const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetBranchinventory: require("./dbGetBranchinventory"),
  dbCreateBranchinventory: require("./dbCreateBranchinventory"),
  dbUpdateBranchinventory: require("./dbUpdateBranchinventory"),
  dbDeleteBranchinventory: require("./dbDeleteBranchinventory"),
  dbListBranchinventories: require("./dbListBranchinventories"),
  createBranchInventory: utils.createBranchInventory,
  getIdListOfBranchInventoryByField: utils.getIdListOfBranchInventoryByField,
  getBranchInventoryById: utils.getBranchInventoryById,
  getBranchInventoryAggById: utils.getBranchInventoryAggById,
  getBranchInventoryListByQuery: utils.getBranchInventoryListByQuery,
  getBranchInventoryStatsByQuery: utils.getBranchInventoryStatsByQuery,
  getBranchInventoryByQuery: utils.getBranchInventoryByQuery,
  updateBranchInventoryById: utils.updateBranchInventoryById,
  updateBranchInventoryByIdList: utils.updateBranchInventoryByIdList,
  updateBranchInventoryByQuery: utils.updateBranchInventoryByQuery,
  deleteBranchInventoryById: utils.deleteBranchInventoryById,
  deleteBranchInventoryByQuery: utils.deleteBranchInventoryByQuery,
};
