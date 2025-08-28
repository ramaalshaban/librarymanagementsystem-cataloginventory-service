const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetInterbranchtransfer: require("./dbGetInterbranchtransfer"),
  dbCreateInterbranchtransfer: require("./dbCreateInterbranchtransfer"),
  dbUpdateInterbranchtransfer: require("./dbUpdateInterbranchtransfer"),
  dbDeleteInterbranchtransfer: require("./dbDeleteInterbranchtransfer"),
  dbListInterbranchtransfers: require("./dbListInterbranchtransfers"),
  createInterBranchTransfer: utils.createInterBranchTransfer,
  getIdListOfInterBranchTransferByField:
    utils.getIdListOfInterBranchTransferByField,
  getInterBranchTransferById: utils.getInterBranchTransferById,
  getInterBranchTransferAggById: utils.getInterBranchTransferAggById,
  getInterBranchTransferListByQuery: utils.getInterBranchTransferListByQuery,
  getInterBranchTransferStatsByQuery: utils.getInterBranchTransferStatsByQuery,
  getInterBranchTransferByQuery: utils.getInterBranchTransferByQuery,
  updateInterBranchTransferById: utils.updateInterBranchTransferById,
  updateInterBranchTransferByIdList: utils.updateInterBranchTransferByIdList,
  updateInterBranchTransferByQuery: utils.updateInterBranchTransferByQuery,
  deleteInterBranchTransferById: utils.deleteInterBranchTransferById,
  deleteInterBranchTransferByQuery: utils.deleteInterBranchTransferByQuery,
};
