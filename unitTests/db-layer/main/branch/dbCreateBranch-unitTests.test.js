const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateBranchCommand is exported from main code
describe("DbCreateBranchCommand", () => {
  let DbCreateBranchCommand, dbCreateBranch;
  let sandbox,
    BranchStub,
    ElasticIndexerStub,
    getBranchByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getBranchByIdStub = sandbox.stub().resolves({ id: 1, name: "Mock Client" });

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

    ({ DbCreateBranchCommand, dbCreateBranch } = proxyquire(
      "../../../../src/db-layer/main/branch/dbCreateBranch",
      {
        models: { Branch: BranchStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getBranchById": getBranchByIdStub,
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
      const cmd = new DbCreateBranchCommand({});
      expect(cmd.commandName).to.equal("dbCreateBranch");
      expect(cmd.objectName).to.equal("branch");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-branch-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getBranchById and indexData", async () => {
      const cmd = new DbCreateBranchCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getBranchByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing branch if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockbranch = { update: updateStub, getData: () => ({ id: 2 }) };

      BranchStub.findOne = sandbox.stub().resolves(mockbranch);
      BranchStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateBranchCommand(input);
      await cmd.runDbCommand();

      expect(input.branch).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new branch if no unique match is found", async () => {
      BranchStub.findOne = sandbox.stub().resolves(null);
      BranchStub.findByPk = sandbox.stub().resolves(null);
      BranchStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateBranchCommand(input);
      await cmd.runDbCommand();

      expect(input.branch).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(BranchStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      BranchStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateBranchCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateBranch", () => {
    it("should execute successfully and return dbData", async () => {
      BranchStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "branch" } };
      const result = await dbCreateBranch(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
