const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateBookCommand is exported from main code
describe("DbCreateBookCommand", () => {
  let DbCreateBookCommand, dbCreateBook;
  let sandbox, BookStub, ElasticIndexerStub, getBookByIdStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BookStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getBookByIdStub = sandbox.stub().resolves({ id: 1, name: "Mock Client" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input) {
        this.input = input;
        this.dataClause = input.dataClause || {};
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: 9 };
      }

      async runDbCommand() {}
      async execute() {
        return this.dbData;
      }
      loadHookFunctions() {}
      createEntityCacher() {}
      normalizeSequalizeOps(w) {
        return w;
      }
      createQueryCacheInvalidator() {}
    };

    ({ DbCreateBookCommand, dbCreateBook } = proxyquire(
      "../../../../src/db-layer/main/book/dbCreateBook",
      {
        models: { Book: BookStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getBookById": getBookByIdStub,
        dbCommand: { DBCreateSequelizeCommand: BaseCommandStub },
        "./query-cache-classes": {
          ClientQueryCacheInvalidator: sandbox.stub(),
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
    it("should assign initial properties", () => {
      const cmd = new DbCreateBookCommand({});
      expect(cmd.commandName).to.equal("dbCreateBook");
      expect(cmd.objectName).to.equal("book");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-book-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getBookById and indexData", async () => {
      const cmd = new DbCreateBookCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getBookByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing book if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockbook = { update: updateStub, getData: () => ({ id: 2 }) };

      BookStub.findOne = sandbox.stub().resolves(mockbook);
      BookStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          title: "title_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateBookCommand(input);
      await cmd.runDbCommand();

      expect(input.book).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new book if no unique match is found", async () => {
      BookStub.findOne = sandbox.stub().resolves(null);
      BookStub.findByPk = sandbox.stub().resolves(null);
      BookStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          title: "title_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateBookCommand(input);
      await cmd.runDbCommand();

      expect(input.book).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(BookStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      BookStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateBookCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateBook", () => {
    it("should execute successfully and return dbData", async () => {
      BookStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "book" } };
      const result = await dbCreateBook(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
