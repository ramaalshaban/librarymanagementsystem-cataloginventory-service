module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    bookMcpRouter: require("./book")(headers),
    branchMcpRouter: require("./branch")(headers),
    branchInventoryMcpRouter: require("./branchInventory")(headers),
    inventoryAuditLogMcpRouter: require("./inventoryAuditLog")(headers),
    interBranchTransferMcpRouter: require("./interBranchTransfer")(headers),
    purchaseOrderMcpRouter: require("./purchaseOrder")(headers),
    catalogInventoryShareTokenMcpRouter:
      require("./catalogInventoryShareToken")(headers),
  };
};
