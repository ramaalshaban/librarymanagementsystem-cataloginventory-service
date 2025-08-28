const CatalogInventoryServiceGrpcController = require("./CatalogInventoryServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new CatalogInventoryServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};
