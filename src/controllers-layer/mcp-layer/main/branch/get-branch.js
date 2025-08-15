const { GetBranchManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class GetBranchMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("getBranch", "getbranch", params);
    this.dataName = "branch";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetBranchManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        branch: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            name: z
              .string()
              .max(255)
              .describe("The common name of the library branch."),
            address: z
              .object()
              .optional()
              .nullable()
              .describe(
                "Branch postal address object (street, city, zip, etc).",
              ),
            geoLocation: z
              .object()
              .optional()
              .nullable()
              .describe(
                "GeoJSON Point for branch location (for spatial/proximity queries).",
              ),
            contactEmail: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Branch or staff contact email for inquiries."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a physical library branch for catalog holdings: names, contact details, and geocoordinates for geospatial/proximity queries.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      branchId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that is queried",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "getBranch",
    description: "Get a branch by ID.",
    parameters: GetBranchMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getBranchMcpController = new GetBranchMcpController(mcpParams);
      try {
        const result = await getBranchMcpController.processRequest();
        //return GetBranchMcpController.getOutputSchema().parse(result);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};
