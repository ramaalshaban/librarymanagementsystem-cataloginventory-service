const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetInventoryauditlog: require("./dbGetInventoryauditlog"),
  dbCreateInventoryauditlog: require("./dbCreateInventoryauditlog"),
  dbUpdateInventoryauditlog: require("./dbUpdateInventoryauditlog"),
  dbDeleteInventoryauditlog: require("./dbDeleteInventoryauditlog"),
  dbListInventoryauditlogs: require("./dbListInventoryauditlogs"),
  createInventoryAuditLog: utils.createInventoryAuditLog,
  getIdListOfInventoryAuditLogByField:
    utils.getIdListOfInventoryAuditLogByField,
  getInventoryAuditLogById: utils.getInventoryAuditLogById,
  getInventoryAuditLogAggById: utils.getInventoryAuditLogAggById,
  getInventoryAuditLogListByQuery: utils.getInventoryAuditLogListByQuery,
  getInventoryAuditLogStatsByQuery: utils.getInventoryAuditLogStatsByQuery,
  getInventoryAuditLogByQuery: utils.getInventoryAuditLogByQuery,
  updateInventoryAuditLogById: utils.updateInventoryAuditLogById,
  updateInventoryAuditLogByIdList: utils.updateInventoryAuditLogByIdList,
  updateInventoryAuditLogByQuery: utils.updateInventoryAuditLogByQuery,
  deleteInventoryAuditLogById: utils.deleteInventoryAuditLogById,
  deleteInventoryAuditLogByQuery: utils.deleteInventoryAuditLogByQuery,
};
