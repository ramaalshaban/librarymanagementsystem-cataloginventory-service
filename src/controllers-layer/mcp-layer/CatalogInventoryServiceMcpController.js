const McpController = require("./McpController");

class CatalogInventoryServiceMcpController extends McpController {
  constructor(name, routeName, req, res) {
    super(name, routeName, req, res);
    this.projectCodename = "librarymanagementsystem";
    this.isMultiTenant = false;
    this.tenantName = "";
    this.tenantId = "";
    this.tenantCodename = null;
    this.isLoginApi = false;
  }

  createApiManager() {
    return null;
  }
}

module.exports = CatalogInventoryServiceMcpController;
