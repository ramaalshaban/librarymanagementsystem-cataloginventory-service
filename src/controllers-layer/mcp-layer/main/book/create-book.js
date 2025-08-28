const { CreateBookManager } = require("managers");
const { z } = require("zod");

const CatalogInventoryMcpController = require("../../CatalogInventoryServiceMcpController");

class CreateBookMcpController extends CatalogInventoryMcpController {
  constructor(params) {
    super("createBook", "createbook", params);
    this.dataName = "book";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateBookManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        book: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            title: z
              .string()
              .max(255)
              .describe("The canonical title of the book/work."),
            authors: z.array(
              z
                .string()
                .max(255)
                .describe(
                  "List of authors (for multi-author works, in order as credited).",
                ),
            ),
            isbn: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "International Standard Book Number (ISBN-10 or ISBN-13).",
              ),
            synopsis: z
              .string()
              .optional()
              .nullable()
              .describe("Short/long description or synopsis of the book."),
            genres: z.array(
              z
                .string()
                .max(255)
                .optional()
                .nullable()
                .describe(
                  "Genres/categories assigned to the book (e.g. Fiction, Science, Children, Biography).",
                ),
            ),
            publicationDate: z
              .string()
              .optional()
              .nullable()
              .describe("Publication date (first edition or this edition)."),
            language: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Primary language of the book."),
            publisher: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Publisher of the edition."),
            coverImageUrl: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe("Optional cover image URL for the book."),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Master catalog record for a book or multi-copy item; includes bibliographic metadata, ISBN, authors, genres, full-text and geospatial search fields.",
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
      title: z
        .string()
        .max(255)
        .describe("The canonical title of the book/work."),

      authors: z
        .string()
        .max(255)
        .describe(
          "List of authors (for multi-author works, in order as credited).",
        ),

      isbn: z
        .string()
        .max(255)
        .optional()
        .describe("International Standard Book Number (ISBN-10 or ISBN-13)."),

      synopsis: z
        .string()
        .optional()
        .describe("Short/long description or synopsis of the book."),

      genres: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Genres/categories assigned to the book (e.g. Fiction, Science, Children, Biography).",
        ),

      publicationDate: z
        .string()
        .optional()
        .describe("Publication date (first edition or this edition)."),

      language: z
        .string()
        .max(255)
        .optional()
        .describe("Primary language of the book."),

      publisher: z
        .string()
        .max(255)
        .optional()
        .describe("Publisher of the edition."),

      coverImageUrl: z
        .string()
        .max(255)
        .optional()
        .describe("Optional cover image URL for the book."),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createBook",
    description: "Create a new master book/catalog record entry.",
    parameters: CreateBookMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createBookMcpController = new CreateBookMcpController(mcpParams);
      try {
        const result = await createBookMcpController.processRequest();
        //return CreateBookMcpController.getOutputSchema().parse(result);
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
