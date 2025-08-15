const { UpdateInventoryAuditLogManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class UpdateInventoryAuditLogMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("updateInventoryAuditLog", "updateinventoryauditlog", params);
    this.dataName = "inventoryAuditLog";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateInventoryAuditLogManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        inventoryAuditLog: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            branchId: z
              .string()
              .uuid()
              .describe("Branch where audit/adjustment occurs."),
            branchInventoryId: z
              .string()
              .uuid()
              .describe(
                "Inventory record at branch for this adjustment/event.",
              ),
            auditType: z
              .enum(["audit", "damage", "loss", "discrepancy", "adjustment"])
              .describe(
                "Type of audit or adjustment: inventory, damage, loss, etc.",
              ),
            detailNote: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Notes/details for this audit/discrepancy entry (explanation, corrective action, etc).",
              ),
            adjustmentValue: z
              .number()
              .int()
              .optional()
              .nullable()
              .describe(
                "Adjustment: +n/-n to available copies (for missing, found, disposed books).",
              ),
            recordedByUserId: z
              .string()
              .uuid()
              .describe("User (staff) who recorded this audit entry."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Log/audit entries of inventory audits, discrepancy findings, loss/damage/adjustment events during branch stock checks.",
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
      inventoryAuditLogId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      auditType: z
        .enum([])
        .optional()
        .describe("Type of audit or adjustment: inventory, damage, loss, etc."),

      detailNote: z
        .string()
        .optional()
        .describe(
          "Notes/details for this audit/discrepancy entry (explanation, corrective action, etc).",
        ),

      adjustmentValue: z
        .number()
        .int()
        .optional()
        .describe(
          "Adjustment: +n/-n to available copies (for missing, found, disposed books).",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateInventoryAuditLog",
    description:
      "Update an inventory audit/adjustment log entry (only editable fields).",
    parameters: UpdateInventoryAuditLogMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateInventoryAuditLogMcpController =
        new UpdateInventoryAuditLogMcpController(mcpParams);
      try {
        const result =
          await updateInventoryAuditLogMcpController.processRequest();
        //return UpdateInventoryAuditLogMcpController.getOutputSchema().parse(result);
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
