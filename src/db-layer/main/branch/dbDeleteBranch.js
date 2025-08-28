const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { Branch } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  getIdListOfBranchInventoryByField,
  updateBranchInventoryById,
  deleteBranchInventoryById,
} = require("../branchInventory");

const { BranchQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteBranchCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Branch, instanceMode);
    this.commandName = "dbDeleteBranch";
    this.nullResult = false;
    this.objectName = "branch";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service" +
      "-dbevent-" +
      "branch-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new BranchQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "branch",
      this.session,
      this.requestId,
    );
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }

  async syncJoins() {
    const promises = [];
    const dataId = this.dbData.id;
    // relationTargetKey should be used instead of id
    try {
      // delete refrring objects

      // update referring objects

      // delete childs
      const idList_BranchInventory_branchId_branch =
        await getIdListOfBranchInventoryByField(
          "branchId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_BranchInventory_branchId_branch) {
        promises.push(deleteBranchInventoryById(itemId));
      }

      const idList_InventoryAuditLog_branchId_branch =
        await getIdListOfInventoryAuditLogByField(
          "branchId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_InventoryAuditLog_branchId_branch) {
        promises.push(deleteInventoryAuditLogById(itemId));
      }

      const idList_InterBranchTransfer_sourceBranchId_sourceBranch =
        await getIdListOfInterBranchTransferByField(
          "sourceBranchId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_InterBranchTransfer_sourceBranchId_sourceBranch) {
        promises.push(deleteInterBranchTransferById(itemId));
      }

      const idList_InterBranchTransfer_destBranchId_destBranch =
        await getIdListOfInterBranchTransferByField(
          "destBranchId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_InterBranchTransfer_destBranchId_destBranch) {
        promises.push(deleteInterBranchTransferById(itemId));
      }

      const idList_PurchaseOrder_branchId_branch =
        await getIdListOfPurchaseOrderByField(
          "branchId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_PurchaseOrder_branchId_branch) {
        promises.push(deletePurchaseOrderById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Branch on joined and parent objects:",
            dataId,
            result,
          );
          hexaLogger.insertError(
            "SyncJoinError",
            { function: "syncJoins", dataId: dataId },
            "->syncJoins",
            result,
          );
        }
      }
    } catch (err) {
      console.log(
        "Total Error when synching delete of Branch on joined and parent objects:",
        dataId,
        err,
      );
      hexaLogger.insertError(
        "SyncJoinsTotalError",
        { function: "syncJoins", dataId: dataId },
        "->syncJoins",
        err,
      );
    }
  }
}

const dbDeleteBranch = async (input) => {
  input.id = input.branchId;
  const dbDeleteCommand = new DbDeleteBranchCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteBranch;
