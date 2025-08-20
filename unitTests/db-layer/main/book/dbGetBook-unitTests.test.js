const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetBookCommand is exported from main code

describe("DbGetBookCommand", () => {
  let DbGetBookCommand, dbGetBook;
  let sandbox, BookStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.bookId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetBookCommand, dbGetBook } = proxyquire(
      "../../../../src/db-layer/main/book/dbGetBook",
      {
        models: { Book: BookStub },
        dbCommand: {
          DBGetSequelizeCommand: BaseCommandStub,
        },
        common: {
          HttpServerError: class extends Error {
            constructor(msg, details) {
              super(msg);
              this.details = details;
            }
          },
        },
      },
    ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbGetBookCommand({});
      expect(cmd.commandName).to.equal("dbGetBook");
      expect(cmd.objectName).to.equal("book");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Book.getCqrsJoins if exists", async () => {
      const cmd = new DbGetBookCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(BookStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete BookStub.getCqrsJoins;
      const cmd = new DbGetBookCommand({});
      let errorThrown = false;
      try {
        await cmd.getCqrsJoins({});
      } catch (err) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbGetBookCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetBookCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetBook", () => {
    it("should execute dbGetBook and return book data", async () => {
      const result = await dbGetBook({
        bookId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
