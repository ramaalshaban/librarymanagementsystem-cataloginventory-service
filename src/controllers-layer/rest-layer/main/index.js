module.exports = {
  // main Database Crud Object Rest Api Routers
  bookRouter: require("./book"),
  branchRouter: require("./branch"),
  branchInventoryRouter: require("./branchInventory"),
  inventoryAuditLogRouter: require("./inventoryAuditLog"),
  interBranchTransferRouter: require("./interBranchTransfer"),
  purchaseOrderRouter: require("./purchaseOrder"),
  catalogInventoryShareTokenRouter: require("./catalogInventoryShareToken"),
};
