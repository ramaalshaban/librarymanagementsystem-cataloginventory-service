const { HttpServerError } = require("common");

const { PurchaseOrder } = require("models");

const getPurchaseOrderAggById = async (purchaseOrderId) => {
  try {
    let purchaseOrderQuery;

    if (Array.isArray(purchaseOrderId)) {
      purchaseOrderQuery = PurchaseOrder.find({
        _id: { $in: purchaseOrderId },
        isActive: true,
      });
    } else {
      purchaseOrderQuery = PurchaseOrder.findOne({
        _id: purchaseOrderId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const purchaseOrder = await purchaseOrderQuery.exec();

    if (!purchaseOrder) {
      return null;
    }
    const purchaseOrderData =
      Array.isArray(purchaseOrderId) && purchaseOrderId.length > 0
        ? purchaseOrder.map((item) => item.getData())
        : purchaseOrder.getData();

    // should i add this here?
    await PurchaseOrder.getCqrsJoins(purchaseOrderData);

    return purchaseOrderData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPurchaseOrderAggById",
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

module.exports = getPurchaseOrderAggById;
