const { HttpServerError } = require("common");

const { InterBranchTransfer } = require("models");

const getInterBranchTransferAggById = async (interBranchTransferId) => {
  try {
    let interBranchTransferQuery;

    if (Array.isArray(interBranchTransferId)) {
      interBranchTransferQuery = InterBranchTransfer.find({
        _id: { $in: interBranchTransferId },
        isActive: true,
      });
    } else {
      interBranchTransferQuery = InterBranchTransfer.findOne({
        _id: interBranchTransferId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const interBranchTransfer = await interBranchTransferQuery.exec();

    if (!interBranchTransfer) {
      return null;
    }
    const interBranchTransferData =
      Array.isArray(interBranchTransferId) && interBranchTransferId.length > 0
        ? interBranchTransfer.map((item) => item.getData())
        : interBranchTransfer.getData();

    // should i add this here?
    await InterBranchTransfer.getCqrsJoins(interBranchTransferData);

    return interBranchTransferData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingInterBranchTransferAggById",
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

module.exports = getInterBranchTransferAggById;
