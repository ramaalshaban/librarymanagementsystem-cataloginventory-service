module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Book Db Object
  GetBookManager: require("./book/get-book"),
  CreateBookManager: require("./book/create-book"),
  UpdateBookManager: require("./book/update-book"),
  DeleteBookManager: require("./book/delete-book"),
  ListBooksManager: require("./book/list-books"),
  // Branch Db Object
  GetBranchManager: require("./branch/get-branch"),
  CreateBranchManager: require("./branch/create-branch"),
  UpdateBranchManager: require("./branch/update-branch"),
  DeleteBranchManager: require("./branch/delete-branch"),
  ListBranchesManager: require("./branch/list-branches"),
  // BranchInventory Db Object
  GetBranchInventoryManager: require("./branchInventory/get-branchinventory"),
  CreateBranchInventoryManager: require("./branchInventory/create-branchinventory"),
  UpdateBranchInventoryManager: require("./branchInventory/update-branchinventory"),
  DeleteBranchInventoryManager: require("./branchInventory/delete-branchinventory"),
  ListBranchInventoriesManager: require("./branchInventory/list-branchinventories"),
  // InventoryAuditLog Db Object
  GetInventoryAuditLogManager: require("./inventoryAuditLog/get-inventoryauditlog"),
  CreateInventoryAuditLogManager: require("./inventoryAuditLog/create-inventoryauditlog"),
  UpdateInventoryAuditLogManager: require("./inventoryAuditLog/update-inventoryauditlog"),
  DeleteInventoryAuditLogManager: require("./inventoryAuditLog/delete-inventoryauditlog"),
  ListInventoryAuditLogsManager: require("./inventoryAuditLog/list-inventoryauditlogs"),
  // InterBranchTransfer Db Object
  GetInterBranchTransferManager: require("./interBranchTransfer/get-interbranchtransfer"),
  CreateInterBranchTransferManager: require("./interBranchTransfer/create-interbranchtransfer"),
  UpdateInterBranchTransferManager: require("./interBranchTransfer/update-interbranchtransfer"),
  DeleteInterBranchTransferManager: require("./interBranchTransfer/delete-interbranchtransfer"),
  ListInterBranchTransfersManager: require("./interBranchTransfer/list-interbranchtransfers"),
  // PurchaseOrder Db Object
  GetPurchaseOrderManager: require("./purchaseOrder/get-purchaseorder"),
  CreatePurchaseOrderManager: require("./purchaseOrder/create-purchaseorder"),
  UpdatePurchaseOrderManager: require("./purchaseOrder/update-purchaseorder"),
  DeletePurchaseOrderManager: require("./purchaseOrder/delete-purchaseorder"),
  ListPurchaseOrdersManager: require("./purchaseOrder/list-purchaseorders"),
  // CatalogInventoryShareToken Db Object
};
