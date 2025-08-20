const mainFunctions = require("./main");

module.exports = {
  // main Database
  // Book Db Object
  dbGetBook: mainFunctions.dbGetBook,
  dbCreateBook: mainFunctions.dbCreateBook,
  dbUpdateBook: mainFunctions.dbUpdateBook,
  dbDeleteBook: mainFunctions.dbDeleteBook,
  dbListBooks: mainFunctions.dbListBooks,
  createBook: mainFunctions.createBook,
  getIdListOfBookByField: mainFunctions.getIdListOfBookByField,
  getBookById: mainFunctions.getBookById,
  getBookAggById: mainFunctions.getBookAggById,
  getBookListByQuery: mainFunctions.getBookListByQuery,
  getBookStatsByQuery: mainFunctions.getBookStatsByQuery,
  getBookByQuery: mainFunctions.getBookByQuery,
  updateBookById: mainFunctions.updateBookById,
  updateBookByIdList: mainFunctions.updateBookByIdList,
  updateBookByQuery: mainFunctions.updateBookByQuery,
  deleteBookById: mainFunctions.deleteBookById,
  deleteBookByQuery: mainFunctions.deleteBookByQuery,
  getBookByIsbn: mainFunctions.getBookByIsbn,

  // Branch Db Object
  dbGetBranch: mainFunctions.dbGetBranch,
  dbCreateBranch: mainFunctions.dbCreateBranch,
  dbUpdateBranch: mainFunctions.dbUpdateBranch,
  dbDeleteBranch: mainFunctions.dbDeleteBranch,
  dbListBranches: mainFunctions.dbListBranches,
  createBranch: mainFunctions.createBranch,
  getIdListOfBranchByField: mainFunctions.getIdListOfBranchByField,
  getBranchById: mainFunctions.getBranchById,
  getBranchAggById: mainFunctions.getBranchAggById,
  getBranchListByQuery: mainFunctions.getBranchListByQuery,
  getBranchStatsByQuery: mainFunctions.getBranchStatsByQuery,
  getBranchByQuery: mainFunctions.getBranchByQuery,
  updateBranchById: mainFunctions.updateBranchById,
  updateBranchByIdList: mainFunctions.updateBranchByIdList,
  updateBranchByQuery: mainFunctions.updateBranchByQuery,
  deleteBranchById: mainFunctions.deleteBranchById,
  deleteBranchByQuery: mainFunctions.deleteBranchByQuery,

  // BranchInventory Db Object
  dbGetBranchinventory: mainFunctions.dbGetBranchinventory,
  dbCreateBranchinventory: mainFunctions.dbCreateBranchinventory,
  dbUpdateBranchinventory: mainFunctions.dbUpdateBranchinventory,
  dbDeleteBranchinventory: mainFunctions.dbDeleteBranchinventory,
  dbListBranchinventories: mainFunctions.dbListBranchinventories,
  createBranchInventory: mainFunctions.createBranchInventory,
  getIdListOfBranchInventoryByField:
    mainFunctions.getIdListOfBranchInventoryByField,
  getBranchInventoryById: mainFunctions.getBranchInventoryById,
  getBranchInventoryAggById: mainFunctions.getBranchInventoryAggById,
  getBranchInventoryListByQuery: mainFunctions.getBranchInventoryListByQuery,
  getBranchInventoryStatsByQuery: mainFunctions.getBranchInventoryStatsByQuery,
  getBranchInventoryByQuery: mainFunctions.getBranchInventoryByQuery,
  updateBranchInventoryById: mainFunctions.updateBranchInventoryById,
  updateBranchInventoryByIdList: mainFunctions.updateBranchInventoryByIdList,
  updateBranchInventoryByQuery: mainFunctions.updateBranchInventoryByQuery,
  deleteBranchInventoryById: mainFunctions.deleteBranchInventoryById,
  deleteBranchInventoryByQuery: mainFunctions.deleteBranchInventoryByQuery,

  // InventoryAuditLog Db Object
  dbGetInventoryauditlog: mainFunctions.dbGetInventoryauditlog,
  dbCreateInventoryauditlog: mainFunctions.dbCreateInventoryauditlog,
  dbUpdateInventoryauditlog: mainFunctions.dbUpdateInventoryauditlog,
  dbDeleteInventoryauditlog: mainFunctions.dbDeleteInventoryauditlog,
  dbListInventoryauditlogs: mainFunctions.dbListInventoryauditlogs,
  createInventoryAuditLog: mainFunctions.createInventoryAuditLog,
  getIdListOfInventoryAuditLogByField:
    mainFunctions.getIdListOfInventoryAuditLogByField,
  getInventoryAuditLogById: mainFunctions.getInventoryAuditLogById,
  getInventoryAuditLogAggById: mainFunctions.getInventoryAuditLogAggById,
  getInventoryAuditLogListByQuery:
    mainFunctions.getInventoryAuditLogListByQuery,
  getInventoryAuditLogStatsByQuery:
    mainFunctions.getInventoryAuditLogStatsByQuery,
  getInventoryAuditLogByQuery: mainFunctions.getInventoryAuditLogByQuery,
  updateInventoryAuditLogById: mainFunctions.updateInventoryAuditLogById,
  updateInventoryAuditLogByIdList:
    mainFunctions.updateInventoryAuditLogByIdList,
  updateInventoryAuditLogByQuery: mainFunctions.updateInventoryAuditLogByQuery,
  deleteInventoryAuditLogById: mainFunctions.deleteInventoryAuditLogById,
  deleteInventoryAuditLogByQuery: mainFunctions.deleteInventoryAuditLogByQuery,

  // InterBranchTransfer Db Object
  dbGetInterbranchtransfer: mainFunctions.dbGetInterbranchtransfer,
  dbCreateInterbranchtransfer: mainFunctions.dbCreateInterbranchtransfer,
  dbUpdateInterbranchtransfer: mainFunctions.dbUpdateInterbranchtransfer,
  dbDeleteInterbranchtransfer: mainFunctions.dbDeleteInterbranchtransfer,
  dbListInterbranchtransfers: mainFunctions.dbListInterbranchtransfers,
  createInterBranchTransfer: mainFunctions.createInterBranchTransfer,
  getIdListOfInterBranchTransferByField:
    mainFunctions.getIdListOfInterBranchTransferByField,
  getInterBranchTransferById: mainFunctions.getInterBranchTransferById,
  getInterBranchTransferAggById: mainFunctions.getInterBranchTransferAggById,
  getInterBranchTransferListByQuery:
    mainFunctions.getInterBranchTransferListByQuery,
  getInterBranchTransferStatsByQuery:
    mainFunctions.getInterBranchTransferStatsByQuery,
  getInterBranchTransferByQuery: mainFunctions.getInterBranchTransferByQuery,
  updateInterBranchTransferById: mainFunctions.updateInterBranchTransferById,
  updateInterBranchTransferByIdList:
    mainFunctions.updateInterBranchTransferByIdList,
  updateInterBranchTransferByQuery:
    mainFunctions.updateInterBranchTransferByQuery,
  deleteInterBranchTransferById: mainFunctions.deleteInterBranchTransferById,
  deleteInterBranchTransferByQuery:
    mainFunctions.deleteInterBranchTransferByQuery,

  // PurchaseOrder Db Object
  dbGetPurchaseorder: mainFunctions.dbGetPurchaseorder,
  dbCreatePurchaseorder: mainFunctions.dbCreatePurchaseorder,
  dbUpdatePurchaseorder: mainFunctions.dbUpdatePurchaseorder,
  dbDeletePurchaseorder: mainFunctions.dbDeletePurchaseorder,
  dbListPurchaseorders: mainFunctions.dbListPurchaseorders,
  createPurchaseOrder: mainFunctions.createPurchaseOrder,
  getIdListOfPurchaseOrderByField:
    mainFunctions.getIdListOfPurchaseOrderByField,
  getPurchaseOrderById: mainFunctions.getPurchaseOrderById,
  getPurchaseOrderAggById: mainFunctions.getPurchaseOrderAggById,
  getPurchaseOrderListByQuery: mainFunctions.getPurchaseOrderListByQuery,
  getPurchaseOrderStatsByQuery: mainFunctions.getPurchaseOrderStatsByQuery,
  getPurchaseOrderByQuery: mainFunctions.getPurchaseOrderByQuery,
  updatePurchaseOrderById: mainFunctions.updatePurchaseOrderById,
  updatePurchaseOrderByIdList: mainFunctions.updatePurchaseOrderByIdList,
  updatePurchaseOrderByQuery: mainFunctions.updatePurchaseOrderByQuery,
  deletePurchaseOrderById: mainFunctions.deletePurchaseOrderById,
  deletePurchaseOrderByQuery: mainFunctions.deletePurchaseOrderByQuery,

  // CatalogInventoryShareToken Db Object
  createCatalogInventoryShareToken:
    mainFunctions.createCatalogInventoryShareToken,
  getIdListOfCatalogInventoryShareTokenByField:
    mainFunctions.getIdListOfCatalogInventoryShareTokenByField,
  getCatalogInventoryShareTokenById:
    mainFunctions.getCatalogInventoryShareTokenById,
  getCatalogInventoryShareTokenAggById:
    mainFunctions.getCatalogInventoryShareTokenAggById,
  getCatalogInventoryShareTokenListByQuery:
    mainFunctions.getCatalogInventoryShareTokenListByQuery,
  getCatalogInventoryShareTokenStatsByQuery:
    mainFunctions.getCatalogInventoryShareTokenStatsByQuery,
  getCatalogInventoryShareTokenByQuery:
    mainFunctions.getCatalogInventoryShareTokenByQuery,
  updateCatalogInventoryShareTokenById:
    mainFunctions.updateCatalogInventoryShareTokenById,
  updateCatalogInventoryShareTokenByIdList:
    mainFunctions.updateCatalogInventoryShareTokenByIdList,
  updateCatalogInventoryShareTokenByQuery:
    mainFunctions.updateCatalogInventoryShareTokenByQuery,
  deleteCatalogInventoryShareTokenById:
    mainFunctions.deleteCatalogInventoryShareTokenById,
  deleteCatalogInventoryShareTokenByQuery:
    mainFunctions.deleteCatalogInventoryShareTokenByQuery,
};
