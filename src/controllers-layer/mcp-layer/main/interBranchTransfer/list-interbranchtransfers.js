const { ListInterBranchTransfersManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class ListInterBranchTransfersMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("listInterBranchTransfers", "listinterbranchtransfers", params);
    this.dataName = "interBranchTransfers";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListInterBranchTransfersManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        interBranchTransfers: z
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
          )
          .array(),
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
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listInterBranchTransfers",
    description:
      "List/search inter-branch book transfer records (by branch, book, status).",
    parameters: ListInterBranchTransfersMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listInterBranchTransfersMcpController =
        new ListInterBranchTransfersMcpController(mcpParams);
      try {
        const result =
          await listInterBranchTransfersMcpController.processRequest();
        //return ListInterBranchTransfersMcpController.getOutputSchema().parse(result);
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
