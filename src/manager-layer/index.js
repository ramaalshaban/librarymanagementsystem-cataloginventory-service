module.exports = {
  CatalogInventoryServiceManager: require("./service-manager/CatalogInventoryServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Book Db Object
  GetBookManager: require("./main/book/get-book"),
  CreateBookManager: require("./main/book/create-book"),
  UpdateBookManager: require("./main/book/update-book"),
  DeleteBookManager: require("./main/book/delete-book"),
  ListBooksManager: require("./main/book/list-books"),
  // Branch Db Object
  GetBranchManager: require("./main/branch/get-branch"),
  CreateBranchManager: require("./main/branch/create-branch"),
  UpdateBranchManager: require("./main/branch/update-branch"),
  DeleteBranchManager: require("./main/branch/delete-branch"),
  ListBranchesManager: require("./main/branch/list-branches"),
  // BranchInventory Db Object
  GetBranchInventoryManager: require("./main/branchInventory/get-branchinventory"),
  CreateBranchInventoryManager: require("./main/branchInventory/create-branchinventory"),
  UpdateBranchInventoryManager: require("./main/branchInventory/update-branchinventory"),
  DeleteBranchInventoryManager: require("./main/branchInventory/delete-branchinventory"),
  ListBranchInventoriesManager: require("./main/branchInventory/list-branchinventories"),
  // InventoryAuditLog Db Object
  GetInventoryAuditLogManager: require("./main/inventoryAuditLog/get-inventoryauditlog"),
  CreateInventoryAuditLogManager: require("./main/inventoryAuditLog/create-inventoryauditlog"),
  UpdateInventoryAuditLogManager: require("./main/inventoryAuditLog/update-inventoryauditlog"),
  DeleteInventoryAuditLogManager: require("./main/inventoryAuditLog/delete-inventoryauditlog"),
  ListInventoryAuditLogsManager: require("./main/inventoryAuditLog/list-inventoryauditlogs"),
  // InterBranchTransfer Db Object
  GetInterBranchTransferManager: require("./main/interBranchTransfer/get-interbranchtransfer"),
  CreateInterBranchTransferManager: require("./main/interBranchTransfer/create-interbranchtransfer"),
  UpdateInterBranchTransferManager: require("./main/interBranchTransfer/update-interbranchtransfer"),
  DeleteInterBranchTransferManager: require("./main/interBranchTransfer/delete-interbranchtransfer"),
  ListInterBranchTransfersManager: require("./main/interBranchTransfer/list-interbranchtransfers"),
  // PurchaseOrder Db Object
  GetPurchaseOrderManager: require("./main/purchaseOrder/get-purchaseorder"),
  CreatePurchaseOrderManager: require("./main/purchaseOrder/create-purchaseorder"),
  UpdatePurchaseOrderManager: require("./main/purchaseOrder/update-purchaseorder"),
  DeletePurchaseOrderManager: require("./main/purchaseOrder/delete-purchaseorder"),
  ListPurchaseOrdersManager: require("./main/purchaseOrder/list-purchaseorders"),
  // CatalogInventoryShareToken Db Object
};
