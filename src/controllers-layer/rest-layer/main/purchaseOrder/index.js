const express = require("express");

// PurchaseOrder Db Object Rest Api Router
const purchaseOrderRouter = express.Router();

// add PurchaseOrder controllers

// getPurchaseOrder controller
purchaseOrderRouter.get(
  "/purchaseorders/:purchaseOrderId",
  require("./get-purchaseorder"),
);
// createPurchaseOrder controller
purchaseOrderRouter.post("/purchaseorders", require("./create-purchaseorder"));
// updatePurchaseOrder controller
purchaseOrderRouter.patch(
  "/purchaseorders/:purchaseOrderId",
  require("./update-purchaseorder"),
);
// deletePurchaseOrder controller
purchaseOrderRouter.delete(
  "/purchaseorders/:purchaseOrderId",
  require("./delete-purchaseorder"),
);
// listPurchaseOrders controller
purchaseOrderRouter.get("/purchaseorders", require("./list-purchaseorders"));

module.exports = purchaseOrderRouter;
