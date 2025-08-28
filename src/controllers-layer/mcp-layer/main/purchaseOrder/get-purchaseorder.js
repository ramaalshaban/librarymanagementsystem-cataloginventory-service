const { GetPurchaseOrderManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class GetPurchaseOrderMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("getPurchaseOrder", "getpurchaseorder", params);
    this.dataName = "purchaseOrder";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetPurchaseOrderManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        purchaseOrder: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            branchId: z
              .string()
              .uuid()
              .describe(
                "Branch from which this purchase order was created/requested.",
              ),
            requestedByUserId: z
              .string()
              .uuid()
              .describe("User/staff who created purchase order."),
            itemRequests: z.array(
              z
                .object()
                .describe(
                  "Requested book (by ID/isbn/title) and quantity (array of objects: {bookId, isbn, title, requestedQuantity})",
                ),
            ),
            status: z
              .enum([
                "requested",
                "approved",
                "rejected",
                "fulfilled",
                "canceled",
              ])
              .describe(
                "Order workflow status (requested, approved, rejected, fulfilled, canceled).",
              ),
            approvalNotes: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Branch manager (or admin) notes on decision, update trail, rejection reasons, etc.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a branch purchase/acquisition request for new catalog items; includes items requested, status, and approval/fulfillment workflow.",
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
      purchaseOrderId: z
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
    name: "getPurchaseOrder",
    description: "Get a branch&#39;s purchase/acquisition order entry.",
    parameters: GetPurchaseOrderMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getPurchaseOrderMcpController = new GetPurchaseOrderMcpController(
        mcpParams,
      );
      try {
        const result = await getPurchaseOrderMcpController.processRequest();
        //return GetPurchaseOrderMcpController.getOutputSchema().parse(result);
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
