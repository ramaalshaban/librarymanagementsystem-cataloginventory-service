const express = require("express");

// InventoryAuditLog Db Object Rest Api Router
const inventoryAuditLogRouter = express.Router();

// add InventoryAuditLog controllers

// getInventoryAuditLog controller
inventoryAuditLogRouter.get(
  "/inventoryauditlogs/:inventoryAuditLogId",
  require("./get-inventoryauditlog"),
);
// createInventoryAuditLog controller
inventoryAuditLogRouter.post(
  "/inventoryauditlogs",
  require("./create-inventoryauditlog"),
);
// updateInventoryAuditLog controller
inventoryAuditLogRouter.patch(
  "/inventoryauditlogs/:inventoryAuditLogId",
  require("./update-inventoryauditlog"),
);
// deleteInventoryAuditLog controller
inventoryAuditLogRouter.delete(
  "/inventoryauditlogs/:inventoryAuditLogId",
  require("./delete-inventoryauditlog"),
);
// listInventoryAuditLogs controller
inventoryAuditLogRouter.get(
  "/inventoryauditlogs",
  require("./list-inventoryauditlogs"),
);

module.exports = inventoryAuditLogRouter;
