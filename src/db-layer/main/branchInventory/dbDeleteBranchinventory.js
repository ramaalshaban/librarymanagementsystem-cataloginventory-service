const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { BranchInventory } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  getIdListOfInventoryAuditLogByField,
  updateInventoryAuditLogById,
  deleteInventoryAuditLogById,
} = require("../inventoryAuditLog");

const {
  BranchInventoryQueryCacheInvalidator,
} = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteBranchinventoryCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, BranchInventory, instanceMode);
    this.commandName = "dbDeleteBranchinventory";
    this.nullResult = false;
    this.objectName = "branchInventory";
    this.serviceLabel = "librarymanagementsystem-cataloginventory-service";
    this.dbEvent =
      "librarymanagementsystem-cataloginventory-service" +
      "-dbevent-" +
      "branchinventory-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new BranchInventoryQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "branchInventory",
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
      const idList_InventoryAuditLog_branchInventoryId_branchInventory =
        await getIdListOfInventoryAuditLogByField(
          "branchInventoryId",
          this.dbData.id,
          false,
        );
      for (const itemId of idList_InventoryAuditLog_branchInventoryId_branchInventory) {
        promises.push(deleteInventoryAuditLogById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of BranchInventory on joined and parent objects:",
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
        "Total Error when synching delete of BranchInventory on joined and parent objects:",
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

const dbDeleteBranchinventory = async (input) => {
  input.id = input.branchInventoryId;
  const dbDeleteCommand = new DbDeleteBranchinventoryCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteBranchinventory;
