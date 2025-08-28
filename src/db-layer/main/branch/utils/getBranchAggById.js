const { HttpServerError } = require("common");

const { Branch } = require("models");

const getBranchAggById = async (branchId) => {
  try {
    let branchQuery;

    if (Array.isArray(branchId)) {
      branchQuery = Branch.find({
        _id: { $in: branchId },
        isActive: true,
      });
    } else {
      branchQuery = Branch.findOne({
        _id: branchId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const branch = await branchQuery.exec();

    if (!branch) {
      return null;
    }
    const branchData =
      Array.isArray(branchId) && branchId.length > 0
        ? branch.map((item) => item.getData())
        : branch.getData();

    // should i add this here?
    await Branch.getCqrsJoins(branchData);

    return branchData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingBranchAggById", err);
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

module.exports = getBranchAggById;
