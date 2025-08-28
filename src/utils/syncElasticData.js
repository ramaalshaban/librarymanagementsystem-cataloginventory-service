const { getBookById, getIdListOfBookByField } = require("dbLayer");
const { getBranchById, getIdListOfBranchByField } = require("dbLayer");
const {
  getBranchInventoryById,
  getIdListOfBranchInventoryByField,
} = require("dbLayer");
const {
  getInventoryAuditLogById,
  getIdListOfInventoryAuditLogByField,
} = require("dbLayer");
const {
  getInterBranchTransferById,
  getIdListOfInterBranchTransferByField,
} = require("dbLayer");
const {
  getPurchaseOrderById,
  getIdListOfPurchaseOrderByField,
} = require("dbLayer");
const {
  getCatalogInventoryShareTokenById,
  getIdListOfCatalogInventoryShareTokenByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexBookData = async () => {
  const bookIndexer = new ElasticIndexer("book", { isSilent: true });
  console.log("Starting to update indexes for Book");

  const idList = (await getIdListOfBookByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getBookById(chunk);
    if (dataList.length) {
      await bookIndexer.indexBulkData(dataList);
      await bookIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexBranchData = async () => {
  const branchIndexer = new ElasticIndexer("branch", { isSilent: true });
  console.log("Starting to update indexes for Branch");

  const idList = (await getIdListOfBranchByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getBranchById(chunk);
    if (dataList.length) {
      await branchIndexer.indexBulkData(dataList);
      await branchIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexBranchInventoryData = async () => {
  const branchInventoryIndexer = new ElasticIndexer("branchInventory", {
    isSilent: true,
  });
  console.log("Starting to update indexes for BranchInventory");

  const idList =
    (await getIdListOfBranchInventoryByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getBranchInventoryById(chunk);
    if (dataList.length) {
      await branchInventoryIndexer.indexBulkData(dataList);
      await branchInventoryIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexInventoryAuditLogData = async () => {
  const inventoryAuditLogIndexer = new ElasticIndexer("inventoryAuditLog", {
    isSilent: true,
  });
  console.log("Starting to update indexes for InventoryAuditLog");

  const idList =
    (await getIdListOfInventoryAuditLogByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getInventoryAuditLogById(chunk);
    if (dataList.length) {
      await inventoryAuditLogIndexer.indexBulkData(dataList);
      await inventoryAuditLogIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexInterBranchTransferData = async () => {
  const interBranchTransferIndexer = new ElasticIndexer("interBranchTransfer", {
    isSilent: true,
  });
  console.log("Starting to update indexes for InterBranchTransfer");

  const idList =
    (await getIdListOfInterBranchTransferByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getInterBranchTransferById(chunk);
    if (dataList.length) {
      await interBranchTransferIndexer.indexBulkData(dataList);
      await interBranchTransferIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexPurchaseOrderData = async () => {
  const purchaseOrderIndexer = new ElasticIndexer("purchaseOrder", {
    isSilent: true,
  });
  console.log("Starting to update indexes for PurchaseOrder");

  const idList =
    (await getIdListOfPurchaseOrderByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPurchaseOrderById(chunk);
    if (dataList.length) {
      await purchaseOrderIndexer.indexBulkData(dataList);
      await purchaseOrderIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexCatalogInventoryShareTokenData = async () => {
  const catalogInventoryShareTokenIndexer = new ElasticIndexer(
    "catalogInventoryShareToken",
    { isSilent: true },
  );
  console.log("Starting to update indexes for CatalogInventoryShareToken");

  const idList =
    (await getIdListOfCatalogInventoryShareTokenByField("isActive", true)) ??
    [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getCatalogInventoryShareTokenById(chunk);
    if (dataList.length) {
      await catalogInventoryShareTokenIndexer.indexBulkData(dataList);
      await catalogInventoryShareTokenIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexBookData();
    console.log("Book agregated data is indexed, total books:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Book data", err.toString());
  }

  try {
    const dataCount = await indexBranchData();
    console.log("Branch agregated data is indexed, total branches:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing Branch data", err.toString());
  }

  try {
    const dataCount = await indexBranchInventoryData();
    console.log(
      "BranchInventory agregated data is indexed, total branchInventories:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing BranchInventory data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexInventoryAuditLogData();
    console.log(
      "InventoryAuditLog agregated data is indexed, total inventoryAuditLogs:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing InventoryAuditLog data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexInterBranchTransferData();
    console.log(
      "InterBranchTransfer agregated data is indexed, total interBranchTransfers:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing InterBranchTransfer data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexPurchaseOrderData();
    console.log(
      "PurchaseOrder agregated data is indexed, total purchaseOrders:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing PurchaseOrder data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexCatalogInventoryShareTokenData();
    console.log(
      "CatalogInventoryShareToken agregated data is indexed, total catalogInventoryShareTokens:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing CatalogInventoryShareToken data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
