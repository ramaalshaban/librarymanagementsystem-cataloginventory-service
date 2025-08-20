const { HttpServerError } = require("common");

const { InventoryAuditLog } = require("models");

const getInventoryAuditLogAggById = async (inventoryAuditLogId) => {
  try {
    let inventoryAuditLogQuery;

    if (Array.isArray(inventoryAuditLogId)) {
      inventoryAuditLogQuery = InventoryAuditLog.find({
        _id: { $in: inventoryAuditLogId },
        isActive: true,
      });
    } else {
      inventoryAuditLogQuery = InventoryAuditLog.findOne({
        _id: inventoryAuditLogId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const inventoryAuditLog = await inventoryAuditLogQuery.exec();

    if (!inventoryAuditLog) {
      return null;
    }
    const inventoryAuditLogData =
      Array.isArray(inventoryAuditLogId) && inventoryAuditLogId.length > 0
        ? inventoryAuditLog.map((item) => item.getData())
        : inventoryAuditLog.getData();

    // should i add this here?
    await InventoryAuditLog.getCqrsJoins(inventoryAuditLogData);

    return inventoryAuditLogData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInventoryAuditLogAggById",
      err,
    );
  }
};

// "__PropertyEnumSettings.doc": "Enum configuration for the data property, applicable when the property type is set to Enum. While enum values are stored as integers in the database, defining the enum options here allows Mindbricks to enrich API responses with human-readable labels, easing interpretation and UI integration. If not defined, only the numeric value will be returned.",
// "PropertyEnumSettings": {
//   "__hasEnumOptions.doc": "Enables support for named enum values when the property type is Enum. Though values are stored as integers, enabling this adds the symbolic name to API responses for clarity.",
//   "__config.doc": "The configuration object for enum options. Leave it null if hasEnumOptions is false.",
//   "__activation": "hasEnumOptions",
//  "__lines": "\
//  a-hasEnumOptions\
//  g-config",
//  "hasEnumOptions": "Boolean",
//  "config": "PropertyEnumSettingsConfig"
//},

module.exports = getInventoryAuditLogAggById;
