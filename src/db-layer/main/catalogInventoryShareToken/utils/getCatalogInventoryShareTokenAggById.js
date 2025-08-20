const { HttpServerError } = require("common");

const { CatalogInventoryShareToken } = require("models");

const getCatalogInventoryShareTokenAggById = async (
  catalogInventoryShareTokenId,
) => {
  try {
    let catalogInventoryShareTokenQuery;

    if (Array.isArray(catalogInventoryShareTokenId)) {
      catalogInventoryShareTokenQuery = CatalogInventoryShareToken.find({
        _id: { $in: catalogInventoryShareTokenId },
        isActive: true,
      });
    } else {
      catalogInventoryShareTokenQuery = CatalogInventoryShareToken.findOne({
        _id: catalogInventoryShareTokenId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const catalogInventoryShareToken =
      await catalogInventoryShareTokenQuery.exec();

    if (!catalogInventoryShareToken) {
      return null;
    }
    const catalogInventoryShareTokenData =
      Array.isArray(catalogInventoryShareTokenId) &&
      catalogInventoryShareTokenId.length > 0
        ? catalogInventoryShareToken.map((item) => item.getData())
        : catalogInventoryShareToken.getData();

    // should i add this here?
    await CatalogInventoryShareToken.getCqrsJoins(
      catalogInventoryShareTokenData,
    );

    return catalogInventoryShareTokenData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenAggById",
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

module.exports = getCatalogInventoryShareTokenAggById;
