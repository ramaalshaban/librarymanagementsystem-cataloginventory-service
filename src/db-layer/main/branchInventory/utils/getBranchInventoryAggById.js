const { HttpServerError } = require("common");

const { BranchInventory } = require("models");

const getBranchInventoryAggById = async (branchInventoryId) => {
  try {
    let branchInventoryQuery;

    if (Array.isArray(branchInventoryId)) {
      branchInventoryQuery = BranchInventory.find({
        _id: { $in: branchInventoryId },
        isActive: true,
      });
    } else {
      branchInventoryQuery = BranchInventory.findOne({
        _id: branchInventoryId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const branchInventory = await branchInventoryQuery.exec();

    if (!branchInventory) {
      return null;
    }
    const branchInventoryData =
      Array.isArray(branchInventoryId) && branchInventoryId.length > 0
        ? branchInventory.map((item) => item.getData())
        : branchInventory.getData();

    // should i add this here?
    await BranchInventory.getCqrsJoins(branchInventoryData);

    return branchInventoryData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingBranchInventoryAggById",
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

module.exports = getBranchInventoryAggById;
