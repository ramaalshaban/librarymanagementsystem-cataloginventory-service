module.exports = (headers) => {
  // PurchaseOrder Db Object Rest Api Router
  const purchaseOrderMcpRouter = [];
  // getPurchaseOrder controller
  purchaseOrderMcpRouter.push(require("./get-purchaseorder")(headers));
  // createPurchaseOrder controller
  purchaseOrderMcpRouter.push(require("./create-purchaseorder")(headers));
  // updatePurchaseOrder controller
  purchaseOrderMcpRouter.push(require("./update-purchaseorder")(headers));
  // deletePurchaseOrder controller
  purchaseOrderMcpRouter.push(require("./delete-purchaseorder")(headers));
  // listPurchaseOrders controller
  purchaseOrderMcpRouter.push(require("./list-purchaseorders")(headers));
  return purchaseOrderMcpRouter;
};
