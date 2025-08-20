const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateBranchinventoryCommand is exported from main code
describe("DbCreateBranchinventoryCommand", () => {
  let DbCreateBranchinventoryCommand, dbCreateBranchinventory;
  let sandbox,
    BranchInventoryStub,
    ElasticIndexerStub,
    getBranchInventoryByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getBranchInventoryByIdStub = sandbox
      .stub()
      .resolves({ id: 1, name: "Mock Client" });

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

    ({ DbCreateBranchinventoryCommand, dbCreateBranchinventory } = proxyquire(
      "../../../../src/db-layer/main/branchInventory/dbCreateBranchinventory",
      {
        models: { BranchInventory: BranchInventoryStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getBranchInventoryById": getBranchInventoryByIdStub,
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
      const cmd = new DbCreateBranchinventoryCommand({});
      expect(cmd.commandName).to.equal("dbCreateBranchinventory");
      expect(cmd.objectName).to.equal("branchInventory");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getBranchInventoryById and indexData", async () => {
      const cmd = new DbCreateBranchinventoryCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getBranchInventoryByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing branchInventory if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockbranchInventory = { update: updateStub, getData: () => ({ id: 2 }) };

      BranchInventoryStub.findOne = sandbox.stub().resolves(mockbranchInventory);
      BranchInventoryStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          branchId: "branchId_value",
          
          bookId: "bookId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateBranchinventoryCommand(input);
      await cmd.runDbCommand();

      expect(input.branchInventory).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new branchInventory if no unique match is found", async () => {
      BranchInventoryStub.findOne = sandbox.stub().resolves(null);
      BranchInventoryStub.findByPk = sandbox.stub().resolves(null);
      BranchInventoryStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          branchId: "branchId_value",
          
          bookId: "bookId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateBranchinventoryCommand(input);
      await cmd.runDbCommand();

      expect(input.branchInventory).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(BranchInventoryStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      BranchInventoryStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateBranchinventoryCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateBranchinventory", () => {
    it("should execute successfully and return dbData", async () => {
      BranchInventoryStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "branchInventory" } };
      const result = await dbCreateBranchinventory(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
