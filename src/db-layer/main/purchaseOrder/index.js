const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetPurchaseorder: require("./dbGetPurchaseorder"),
  dbCreatePurchaseorder: require("./dbCreatePurchaseorder"),
  dbUpdatePurchaseorder: require("./dbUpdatePurchaseorder"),
  dbDeletePurchaseorder: require("./dbDeletePurchaseorder"),
  dbListPurchaseorders: require("./dbListPurchaseorders"),
  createPurchaseOrder: utils.createPurchaseOrder,
  getIdListOfPurchaseOrderByField: utils.getIdListOfPurchaseOrderByField,
  getPurchaseOrderById: utils.getPurchaseOrderById,
  getPurchaseOrderAggById: utils.getPurchaseOrderAggById,
  getPurchaseOrderListByQuery: utils.getPurchaseOrderListByQuery,
  getPurchaseOrderStatsByQuery: utils.getPurchaseOrderStatsByQuery,
  getPurchaseOrderByQuery: utils.getPurchaseOrderByQuery,
  updatePurchaseOrderById: utils.updatePurchaseOrderById,
  updatePurchaseOrderByIdList: utils.updatePurchaseOrderByIdList,
  updatePurchaseOrderByQuery: utils.updatePurchaseOrderByQuery,
  deletePurchaseOrderById: utils.deletePurchaseOrderById,
  deletePurchaseOrderByQuery: utils.deletePurchaseOrderByQuery,
};
