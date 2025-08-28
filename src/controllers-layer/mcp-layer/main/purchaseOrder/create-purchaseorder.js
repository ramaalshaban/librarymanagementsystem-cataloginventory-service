const { CreatePurchaseOrderManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class CreatePurchaseOrderMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("createPurchaseOrder", "createpurchaseorder", params);
    this.dataName = "purchaseOrder";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreatePurchaseOrderManager(this.request, "mcp");
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
      branchId: z
        .string()
        .uuid()
        .describe(
          "Branch from which this purchase order was created/requested.",
        ),

      itemRequests: z
        .object({})
        .describe(
          "Requested book (by ID/isbn/title) and quantity (array of objects: {bookId, isbn, title, requestedQuantity})",
        ),

      status: z
        .enum([])
        .describe(
          "Order workflow status (requested, approved, rejected, fulfilled, canceled).",
        ),

      approvalNotes: z
        .string()
        .optional()
        .describe(
          "Branch manager (or admin) notes on decision, update trail, rejection reasons, etc.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createPurchaseOrder",
    description:
      "Create a new purchase/acquisition order for library holdings.",
    parameters: CreatePurchaseOrderMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createPurchaseOrderMcpController =
        new CreatePurchaseOrderMcpController(mcpParams);
      try {
        const result = await createPurchaseOrderMcpController.processRequest();
        //return CreatePurchaseOrderMcpController.getOutputSchema().parse(result);
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
