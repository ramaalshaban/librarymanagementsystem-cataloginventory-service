const { HttpServerError, BadRequestError } = require("common");

const { CatalogInventoryShareToken } = require("models");

const getCatalogInventoryShareTokenStatsByQuery = async (query, stats) => {
  const promises = [];
  const statLabels = [];
  try {
    const queryWithSoftDelete = {
      ...query,
      isActive: true,
    };

    for (const stat of stats) {
      const statParts = stat.replace("(", "-").replace(")", "").split("-");
      if (stat === "count") {
        promises.push(
          CatalogInventoryShareToken.countDocuments(queryWithSoftDelete),
        );
        statLabels.push("count");
      } else if (statParts.length == 2) {
        if (statParts[0] === "sum") {
          const pipeline = [
            { $match: queryWithSoftDelete },
            { $group: { _id: null, total: { $sum: `$${statParts[1]}` } } },
          ];
          promises.push(
            CatalogInventoryShareToken.aggregate(pipeline).then((result) =>
              result.length > 0 ? result[0].total : 0,
            ),
          );
          statLabels.push("sum-" + statParts[1]);
        } else if (statParts[0] === "avg") {
          const pipeline = [
            { $match: queryWithSoftDelete },
            { $group: { _id: null, average: { $avg: `$${statParts[1]}` } } },
          ];
          promises.push(
            CatalogInventoryShareToken.aggregate(pipeline).then((result) =>
              result.length > 0 ? result[0].average : 0,
            ),
          );
          statLabels.push("avg-" + statParts[1]);
        } else if (statParts[0] === "min") {
          const pipeline = [
            { $match: queryWithSoftDelete },
            { $group: { _id: null, minimum: { $min: `$${statParts[1]}` } } },
          ];
          promises.push(
            CatalogInventoryShareToken.aggregate(pipeline).then((result) =>
              result.length > 0 ? result[0].minimum : null,
            ),
          );
          statLabels.push("min-" + statParts[1]);
        } else if (statParts[0] === "max") {
          const pipeline = [
            { $match: queryWithSoftDelete },
            { $group: { _id: null, maximum: { $max: `$${statParts[1]}` } } },
          ];
          promises.push(
            CatalogInventoryShareToken.aggregate(pipeline).then((result) =>
              result.length > 0 ? result[0].maximum : null,
            ),
          );
          statLabels.push("max-" + statParts[1]);
        }
      }
    }

    if (promises.length == 0) {
      return await CatalogInventoryShareToken.countDocuments(
        queryWithSoftDelete,
      );
    } else if (promises.length == 1) {
      return await promises[0];
    } else {
      const results = await Promise.all(promises);
      return results.reduce((acc, val, index) => {
        acc[statLabels[index]] = val;
        return acc;
      }, {});
    }
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenStatsByQuery",
      err,
    );
  }
};

module.exports = getCatalogInventoryShareTokenStatsByQuery;
