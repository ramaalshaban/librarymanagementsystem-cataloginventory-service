module.exports = (headers) => {
  // InventoryAuditLog Db Object Rest Api Router
  const inventoryAuditLogMcpRouter = [];
  // getInventoryAuditLog controller
  inventoryAuditLogMcpRouter.push(require("./get-inventoryauditlog")(headers));
  // createInventoryAuditLog controller
  inventoryAuditLogMcpRouter.push(
    require("./create-inventoryauditlog")(headers),
  );
  // updateInventoryAuditLog controller
  inventoryAuditLogMcpRouter.push(
    require("./update-inventoryauditlog")(headers),
  );
  // deleteInventoryAuditLog controller
  inventoryAuditLogMcpRouter.push(
    require("./delete-inventoryauditlog")(headers),
  );
  // listInventoryAuditLogs controller
  inventoryAuditLogMcpRouter.push(
    require("./list-inventoryauditlogs")(headers),
  );
  return inventoryAuditLogMcpRouter;
};
