const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "librarymanagementsystem - catalogInventory",
    brand: {
      name: "librarymanagementsystem",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "catalogInventory",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "Book",
        description:
          "Master catalog record for a book or multi-copy item; includes bibliographic metadata, ISBN, authors, genres, full-text and geospatial search fields.",
        reference: {
          tableName: "book",
          properties: [
            {
              name: "title",
              type: "String",
            },

            {
              name: "authors",
              type: "[String]",
            },

            {
              name: "isbn",
              type: "String",
            },

            {
              name: "synopsis",
              type: "Text",
            },

            {
              name: "genres",
              type: "[String]",
            },

            {
              name: "publicationDate",
              type: "Date",
            },

            {
              name: "language",
              type: "String",
            },

            {
              name: "publisher",
              type: "String",
            },

            {
              name: "coverImageUrl",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/books/{bookId}",
            title: "getBook",
            query: [],

            parameters: [
              {
                key: "bookId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/books",
            title: "createBook",
            query: [],

            body: {
              type: "json",
              content: {
                title: "String",
                authors: "String",
                isbn: "String",
                synopsis: "Text",
                genres: "String",
                publicationDate: "Date",
                language: "String",
                publisher: "String",
                coverImageUrl: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/books/{bookId}",
            title: "updateBook",
            query: [],

            body: {
              type: "json",
              content: {
                title: "String",
                authors: "String",
                isbn: "String",
                synopsis: "Text",
                genres: "String",
                publicationDate: "Date",
                language: "String",
                publisher: "String",
                coverImageUrl: "String",
              },
            },

            parameters: [
              {
                key: "bookId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/books/{bookId}",
            title: "deleteBook",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "bookId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/books",
            title: "listBooks",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "Branch",
        description:
          "Represents a physical library branch for catalog holdings: names, contact details, and geocoordinates for geospatial/proximity queries.",
        reference: {
          tableName: "branch",
          properties: [
            {
              name: "name",
              type: "String",
            },

            {
              name: "address",
              type: "Object",
            },

            {
              name: "geoLocation",
              type: "Object",
            },

            {
              name: "contactEmail",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/branches/{branchId}",
            title: "getBranch",
            query: [],

            parameters: [
              {
                key: "branchId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/branches",
            title: "createBranch",
            query: [],

            body: {
              type: "json",
              content: {
                name: "String",
                address: "Object",
                geoLocation: "Object",
                contactEmail: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/branches/{branchId}",
            title: "updateBranch",
            query: [],

            body: {
              type: "json",
              content: {
                name: "String",
                address: "Object",
                geoLocation: "Object",
                contactEmail: "String",
              },
            },

            parameters: [
              {
                key: "branchId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/branches/{branchId}",
            title: "deleteBranch",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "branchId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/branches",
            title: "listBranches",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "BranchInventory",
        description:
          "Links a book with a branch; tracks quantity, availability, local shelf/copy/serial identifiers, and overall condition for per-branch inventory.",
        reference: {
          tableName: "branchInventory",
          properties: [
            {
              name: "bookId",
              type: "ID",
            },

            {
              name: "branchId",
              type: "ID",
            },

            {
              name: "totalCopies",
              type: "Integer",
            },

            {
              name: "availableCopies",
              type: "Integer",
            },

            {
              name: "localShelfLocation",
              type: "String",
            },

            {
              name: "conditionNotes",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/branchinventories/{branchInventoryId}",
            title: "getBranchInventory",
            query: [],

            parameters: [
              {
                key: "branchInventoryId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/branchinventories",
            title: "createBranchInventory",
            query: [],

            body: {
              type: "json",
              content: {
                bookId: "ID",
                branchId: "ID",
                totalCopies: "Integer",
                availableCopies: "Integer",
                localShelfLocation: "String",
                conditionNotes: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/branchinventories/{branchInventoryId}",
            title: "updateBranchInventory",
            query: [],

            body: {
              type: "json",
              content: {
                totalCopies: "Integer",
                availableCopies: "Integer",
                localShelfLocation: "String",
                conditionNotes: "Text",
              },
            },

            parameters: [
              {
                key: "branchInventoryId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/branchinventories/{branchInventoryId}",
            title: "deleteBranchInventory",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "branchInventoryId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/branchinventories",
            title: "listBranchInventories",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "InventoryAuditLog",
        description:
          "Log/audit entries of inventory audits, discrepancy findings, loss/damage/adjustment events during branch stock checks.",
        reference: {
          tableName: "inventoryAuditLog",
          properties: [
            {
              name: "branchId",
              type: "ID",
            },

            {
              name: "branchInventoryId",
              type: "ID",
            },

            {
              name: "auditType",
              type: "Enum",
            },

            {
              name: "detailNote",
              type: "Text",
            },

            {
              name: "adjustmentValue",
              type: "Integer",
            },

            {
              name: "recordedByUserId",
              type: "ID",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/inventoryauditlogs/{inventoryAuditLogId}",
            title: "getInventoryAuditLog",
            query: [],

            parameters: [
              {
                key: "inventoryAuditLogId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/inventoryauditlogs",
            title: "createInventoryAuditLog",
            query: [],

            body: {
              type: "json",
              content: {
                branchId: "ID",
                branchInventoryId: "ID",
                auditType: "Enum",
                detailNote: "Text",
                adjustmentValue: "Integer",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/inventoryauditlogs/{inventoryAuditLogId}",
            title: "updateInventoryAuditLog",
            query: [],

            body: {
              type: "json",
              content: {
                auditType: "Enum",
                detailNote: "Text",
                adjustmentValue: "Integer",
              },
            },

            parameters: [
              {
                key: "inventoryAuditLogId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/inventoryauditlogs/{inventoryAuditLogId}",
            title: "deleteInventoryAuditLog",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "inventoryAuditLogId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/inventoryauditlogs",
            title: "listInventoryAuditLogs",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "InterBranchTransfer",
        description:
          "Tracks in-progress or completed inter-branch transfers of books/materials, including statuses, movement, who requested, and fulfillment actions.",
        reference: {
          tableName: "interBranchTransfer",
          properties: [
            {
              name: "bookId",
              type: "ID",
            },

            {
              name: "sourceBranchId",
              type: "ID",
            },

            {
              name: "destBranchId",
              type: "ID",
            },

            {
              name: "quantity",
              type: "Integer",
            },

            {
              name: "requestedByUserId",
              type: "ID",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "transferLog",
              type: "[Object]",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/interbranchtransfers/{interBranchTransferId}",
            title: "getInterBranchTransfer",
            query: [],

            parameters: [
              {
                key: "interBranchTransferId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/interbranchtransfers",
            title: "createInterBranchTransfer",
            query: [],

            body: {
              type: "json",
              content: {
                bookId: "ID",
                sourceBranchId: "ID",
                destBranchId: "ID",
                quantity: "Integer",
                status: "Enum",
                transferLog: "Object",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/interbranchtransfers/{interBranchTransferId}",
            title: "updateInterBranchTransfer",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                transferLog: "Object",
              },
            },

            parameters: [
              {
                key: "interBranchTransferId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/interbranchtransfers/{interBranchTransferId}",
            title: "deleteInterBranchTransfer",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "interBranchTransferId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/interbranchtransfers",
            title: "listInterBranchTransfers",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "PurchaseOrder",
        description:
          "Represents a branch purchase/acquisition request for new catalog items; includes items requested, status, and approval/fulfillment workflow.",
        reference: {
          tableName: "purchaseOrder",
          properties: [
            {
              name: "branchId",
              type: "ID",
            },

            {
              name: "requestedByUserId",
              type: "ID",
            },

            {
              name: "itemRequests",
              type: "[Object]",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "approvalNotes",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/purchaseorders/{purchaseOrderId}",
            title: "getPurchaseOrder",
            query: [],

            parameters: [
              {
                key: "purchaseOrderId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/purchaseorders",
            title: "createPurchaseOrder",
            query: [],

            body: {
              type: "json",
              content: {
                branchId: "ID",
                itemRequests: "Object",
                status: "Enum",
                approvalNotes: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/purchaseorders/{purchaseOrderId}",
            title: "updatePurchaseOrder",
            query: [],

            body: {
              type: "json",
              content: {
                itemRequests: "Object",
                status: "Enum",
                approvalNotes: "Text",
              },
            },

            parameters: [
              {
                key: "purchaseOrderId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/purchaseorders/{purchaseOrderId}",
            title: "deletePurchaseOrder",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "purchaseOrderId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/purchaseorders",
            title: "listPurchaseOrders",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "CatalogInventoryShareToken",
        description:
          "A data object that stores the share tokens for tokenized access to shared objects.",
        reference: {
          tableName: "catalogInventoryShareToken",
          properties: [
            {
              name: "configName",
              type: "String",
            },

            {
              name: "objectName",
              type: "String",
            },

            {
              name: "objectId",
              type: "ID",
            },

            {
              name: "ownerId",
              type: "ID",
            },

            {
              name: "peopleOption",
              type: "String",
            },

            {
              name: "tokenPermissions",
              type: "",
            },

            {
              name: "allowedEmails",
              type: "",
            },

            {
              name: "expireDate",
              type: "Date",
            },
          ],
        },
        endpoints: [],
      },
    ],
  };

  inject(app, config);
};
