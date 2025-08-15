const { GetInterBranchTransferManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class GetInterBranchTransferMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("getInterBranchTransfer", "getinterbranchtransfer", params);
    this.dataName = "interBranchTransfer";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetInterBranchTransferManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        interBranchTransfer: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            bookId: z
              .string()
              .uuid()
              .describe("Book to transfer (master catalog id)."),
            sourceBranchId: z
              .string()
              .uuid()
              .describe("Branch from which book is sent."),
            destBranchId: z
              .string()
              .uuid()
              .describe("Branch receiving the transfer."),
            quantity: z
              .number()
              .int()
              .describe("Number of copies to transfer."),
            requestedByUserId: z
              .string()
              .uuid()
              .describe("User (staff) who requested the transfer."),
            status: z
              .enum([
                "requested",
                "approved",
                "inTransit",
                "completed",
                "rejected",
                "canceled",
              ])
              .describe(
                "Status (requested, approved, inTransit, completed, rejected, canceled).",
              ),
            transferLog: z.array(
              z
                .object()
                .optional()
                .nullable()
                .describe(
                  "Log array (timestamp, action, userId, note) for steps in the transfer workflow.",
                ),
            ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Tracks in-progress or completed inter-branch transfers of books/materials, including statuses, movement, who requested, and fulfillment actions.",
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
      interBranchTransferId: z
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
    name: "getInterBranchTransfer",
    description: "Get a book&#39;s inter-branch transfer record.",
    parameters: GetInterBranchTransferMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getInterBranchTransferMcpController =
        new GetInterBranchTransferMcpController(mcpParams);
      try {
        const result =
          await getInterBranchTransferMcpController.processRequest();
        //return GetInterBranchTransferMcpController.getOutputSchema().parse(result);
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
