const bookFunctions = require("./book");
const branchFunctions = require("./branch");
const branchInventoryFunctions = require("./branchInventory");
const inventoryAuditLogFunctions = require("./inventoryAuditLog");
const interBranchTransferFunctions = require("./interBranchTransfer");
const purchaseOrderFunctions = require("./purchaseOrder");
const catalogInventoryShareTokenFunctions = require("./catalogInventoryShareToken");

module.exports = {
  // main Database
  // Book Db Object
  dbGetBook: bookFunctions.dbGetBook,
  dbCreateBook: bookFunctions.dbCreateBook,
  dbUpdateBook: bookFunctions.dbUpdateBook,
  dbDeleteBook: bookFunctions.dbDeleteBook,
  dbListBooks: bookFunctions.dbListBooks,
  createBook: bookFunctions.createBook,
  getIdListOfBookByField: bookFunctions.getIdListOfBookByField,
  getBookById: bookFunctions.getBookById,
  getBookAggById: bookFunctions.getBookAggById,
  getBookListByQuery: bookFunctions.getBookListByQuery,
  getBookStatsByQuery: bookFunctions.getBookStatsByQuery,
  getBookByQuery: bookFunctions.getBookByQuery,
  updateBookById: bookFunctions.updateBookById,
  updateBookByIdList: bookFunctions.updateBookByIdList,
  updateBookByQuery: bookFunctions.updateBookByQuery,
  deleteBookById: bookFunctions.deleteBookById,
  deleteBookByQuery: bookFunctions.deleteBookByQuery,
  getBookByIsbn: bookFunctions.getBookByIsbn,

  // Branch Db Object
  dbGetBranch: branchFunctions.dbGetBranch,
  dbCreateBranch: branchFunctions.dbCreateBranch,
  dbUpdateBranch: branchFunctions.dbUpdateBranch,
  dbDeleteBranch: branchFunctions.dbDeleteBranch,
  dbListBranches: branchFunctions.dbListBranches,
  createBranch: branchFunctions.createBranch,
  getIdListOfBranchByField: branchFunctions.getIdListOfBranchByField,
  getBranchById: branchFunctions.getBranchById,
  getBranchAggById: branchFunctions.getBranchAggById,
  getBranchListByQuery: branchFunctions.getBranchListByQuery,
  getBranchStatsByQuery: branchFunctions.getBranchStatsByQuery,
  getBranchByQuery: branchFunctions.getBranchByQuery,
  updateBranchById: branchFunctions.updateBranchById,
  updateBranchByIdList: branchFunctions.updateBranchByIdList,
  updateBranchByQuery: branchFunctions.updateBranchByQuery,
  deleteBranchById: branchFunctions.deleteBranchById,
  deleteBranchByQuery: branchFunctions.deleteBranchByQuery,

  // BranchInventory Db Object
  dbGetBranchinventory: branchInventoryFunctions.dbGetBranchinventory,
  dbCreateBranchinventory: branchInventoryFunctions.dbCreateBranchinventory,
  dbUpdateBranchinventory: branchInventoryFunctions.dbUpdateBranchinventory,
  dbDeleteBranchinventory: branchInventoryFunctions.dbDeleteBranchinventory,
  dbListBranchinventories: branchInventoryFunctions.dbListBranchinventories,
  createBranchInventory: branchInventoryFunctions.createBranchInventory,
  getIdListOfBranchInventoryByField:
    branchInventoryFunctions.getIdListOfBranchInventoryByField,
  getBranchInventoryById: branchInventoryFunctions.getBranchInventoryById,
  getBranchInventoryAggById: branchInventoryFunctions.getBranchInventoryAggById,
  getBranchInventoryListByQuery:
    branchInventoryFunctions.getBranchInventoryListByQuery,
  getBranchInventoryStatsByQuery:
    branchInventoryFunctions.getBranchInventoryStatsByQuery,
  getBranchInventoryByQuery: branchInventoryFunctions.getBranchInventoryByQuery,
  updateBranchInventoryById: branchInventoryFunctions.updateBranchInventoryById,
  updateBranchInventoryByIdList:
    branchInventoryFunctions.updateBranchInventoryByIdList,
  updateBranchInventoryByQuery:
    branchInventoryFunctions.updateBranchInventoryByQuery,
  deleteBranchInventoryById: branchInventoryFunctions.deleteBranchInventoryById,
  deleteBranchInventoryByQuery:
    branchInventoryFunctions.deleteBranchInventoryByQuery,

  // InventoryAuditLog Db Object
  dbGetInventoryauditlog: inventoryAuditLogFunctions.dbGetInventoryauditlog,
  dbCreateInventoryauditlog:
    inventoryAuditLogFunctions.dbCreateInventoryauditlog,
  dbUpdateInventoryauditlog:
    inventoryAuditLogFunctions.dbUpdateInventoryauditlog,
  dbDeleteInventoryauditlog:
    inventoryAuditLogFunctions.dbDeleteInventoryauditlog,
  dbListInventoryauditlogs: inventoryAuditLogFunctions.dbListInventoryauditlogs,
  createInventoryAuditLog: inventoryAuditLogFunctions.createInventoryAuditLog,
  getIdListOfInventoryAuditLogByField:
    inventoryAuditLogFunctions.getIdListOfInventoryAuditLogByField,
  getInventoryAuditLogById: inventoryAuditLogFunctions.getInventoryAuditLogById,
  getInventoryAuditLogAggById:
    inventoryAuditLogFunctions.getInventoryAuditLogAggById,
  getInventoryAuditLogListByQuery:
    inventoryAuditLogFunctions.getInventoryAuditLogListByQuery,
  getInventoryAuditLogStatsByQuery:
    inventoryAuditLogFunctions.getInventoryAuditLogStatsByQuery,
  getInventoryAuditLogByQuery:
    inventoryAuditLogFunctions.getInventoryAuditLogByQuery,
  updateInventoryAuditLogById:
    inventoryAuditLogFunctions.updateInventoryAuditLogById,
  updateInventoryAuditLogByIdList:
    inventoryAuditLogFunctions.updateInventoryAuditLogByIdList,
  updateInventoryAuditLogByQuery:
    inventoryAuditLogFunctions.updateInventoryAuditLogByQuery,
  deleteInventoryAuditLogById:
    inventoryAuditLogFunctions.deleteInventoryAuditLogById,
  deleteInventoryAuditLogByQuery:
    inventoryAuditLogFunctions.deleteInventoryAuditLogByQuery,

  // InterBranchTransfer Db Object
  dbGetInterbranchtransfer:
    interBranchTransferFunctions.dbGetInterbranchtransfer,
  dbCreateInterbranchtransfer:
    interBranchTransferFunctions.dbCreateInterbranchtransfer,
  dbUpdateInterbranchtransfer:
    interBranchTransferFunctions.dbUpdateInterbranchtransfer,
  dbDeleteInterbranchtransfer:
    interBranchTransferFunctions.dbDeleteInterbranchtransfer,
  dbListInterbranchtransfers:
    interBranchTransferFunctions.dbListInterbranchtransfers,
  createInterBranchTransfer:
    interBranchTransferFunctions.createInterBranchTransfer,
  getIdListOfInterBranchTransferByField:
    interBranchTransferFunctions.getIdListOfInterBranchTransferByField,
  getInterBranchTransferById:
    interBranchTransferFunctions.getInterBranchTransferById,
  getInterBranchTransferAggById:
    interBranchTransferFunctions.getInterBranchTransferAggById,
  getInterBranchTransferListByQuery:
    interBranchTransferFunctions.getInterBranchTransferListByQuery,
  getInterBranchTransferStatsByQuery:
    interBranchTransferFunctions.getInterBranchTransferStatsByQuery,
  getInterBranchTransferByQuery:
    interBranchTransferFunctions.getInterBranchTransferByQuery,
  updateInterBranchTransferById:
    interBranchTransferFunctions.updateInterBranchTransferById,
  updateInterBranchTransferByIdList:
    interBranchTransferFunctions.updateInterBranchTransferByIdList,
  updateInterBranchTransferByQuery:
    interBranchTransferFunctions.updateInterBranchTransferByQuery,
  deleteInterBranchTransferById:
    interBranchTransferFunctions.deleteInterBranchTransferById,
  deleteInterBranchTransferByQuery:
    interBranchTransferFunctions.deleteInterBranchTransferByQuery,

  // PurchaseOrder Db Object
  dbGetPurchaseorder: purchaseOrderFunctions.dbGetPurchaseorder,
  dbCreatePurchaseorder: purchaseOrderFunctions.dbCreatePurchaseorder,
  dbUpdatePurchaseorder: purchaseOrderFunctions.dbUpdatePurchaseorder,
  dbDeletePurchaseorder: purchaseOrderFunctions.dbDeletePurchaseorder,
  dbListPurchaseorders: purchaseOrderFunctions.dbListPurchaseorders,
  createPurchaseOrder: purchaseOrderFunctions.createPurchaseOrder,
  getIdListOfPurchaseOrderByField:
    purchaseOrderFunctions.getIdListOfPurchaseOrderByField,
  getPurchaseOrderById: purchaseOrderFunctions.getPurchaseOrderById,
  getPurchaseOrderAggById: purchaseOrderFunctions.getPurchaseOrderAggById,
  getPurchaseOrderListByQuery:
    purchaseOrderFunctions.getPurchaseOrderListByQuery,
  getPurchaseOrderStatsByQuery:
    purchaseOrderFunctions.getPurchaseOrderStatsByQuery,
  getPurchaseOrderByQuery: purchaseOrderFunctions.getPurchaseOrderByQuery,
  updatePurchaseOrderById: purchaseOrderFunctions.updatePurchaseOrderById,
  updatePurchaseOrderByIdList:
    purchaseOrderFunctions.updatePurchaseOrderByIdList,
  updatePurchaseOrderByQuery: purchaseOrderFunctions.updatePurchaseOrderByQuery,
  deletePurchaseOrderById: purchaseOrderFunctions.deletePurchaseOrderById,
  deletePurchaseOrderByQuery: purchaseOrderFunctions.deletePurchaseOrderByQuery,

  // CatalogInventoryShareToken Db Object
  createCatalogInventoryShareToken:
    catalogInventoryShareTokenFunctions.createCatalogInventoryShareToken,
  getIdListOfCatalogInventoryShareTokenByField:
    catalogInventoryShareTokenFunctions.getIdListOfCatalogInventoryShareTokenByField,
  getCatalogInventoryShareTokenById:
    catalogInventoryShareTokenFunctions.getCatalogInventoryShareTokenById,
  getCatalogInventoryShareTokenAggById:
    catalogInventoryShareTokenFunctions.getCatalogInventoryShareTokenAggById,
  getCatalogInventoryShareTokenListByQuery:
    catalogInventoryShareTokenFunctions.getCatalogInventoryShareTokenListByQuery,
  getCatalogInventoryShareTokenStatsByQuery:
    catalogInventoryShareTokenFunctions.getCatalogInventoryShareTokenStatsByQuery,
  getCatalogInventoryShareTokenByQuery:
    catalogInventoryShareTokenFunctions.getCatalogInventoryShareTokenByQuery,
  updateCatalogInventoryShareTokenById:
    catalogInventoryShareTokenFunctions.updateCatalogInventoryShareTokenById,
  updateCatalogInventoryShareTokenByIdList:
    catalogInventoryShareTokenFunctions.updateCatalogInventoryShareTokenByIdList,
  updateCatalogInventoryShareTokenByQuery:
    catalogInventoryShareTokenFunctions.updateCatalogInventoryShareTokenByQuery,
  deleteCatalogInventoryShareTokenById:
    catalogInventoryShareTokenFunctions.deleteCatalogInventoryShareTokenById,
  deleteCatalogInventoryShareTokenByQuery:
    catalogInventoryShareTokenFunctions.deleteCatalogInventoryShareTokenByQuery,
};
