const { GetBranchInventoryManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class GetBranchInventoryMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("getBranchInventory", "getbranchinventory", params);
    this.dataName = "branchInventory";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetBranchInventoryManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        branchInventory: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            bookId: z.string().uuid().describe("Foreign key to book."),
            branchId: z.string().uuid().describe("Foreign key to branch."),
            totalCopies: z
              .number()
              .int()
              .describe("Total number of copies held at this branch."),
            availableCopies: z
              .number()
              .int()
              .describe("Number of un-lent, available copies at this branch."),
            localShelfLocation: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Shelf, area, or local ID for physical asset at branch.",
              ),
            conditionNotes: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Notes on general condition or issues for this holding.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Links a book with a branch; tracks quantity, availability, local shelf/copy/serial identifiers, and overall condition for per-branch inventory.",
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
      branchInventoryId: z
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
    name: "getBranchInventory",
    description: "Get a branch&#39;s inventory record for a book.",
    parameters: GetBranchInventoryMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getBranchInventoryMcpController =
        new GetBranchInventoryMcpController(mcpParams);
      try {
        const result = await getBranchInventoryMcpController.processRequest();
        //return GetBranchInventoryMcpController.getOutputSchema().parse(result);
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
