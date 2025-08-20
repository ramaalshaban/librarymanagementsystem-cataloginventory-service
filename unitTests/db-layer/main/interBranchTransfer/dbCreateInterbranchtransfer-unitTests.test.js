const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateInterbranchtransferCommand is exported from main code
describe("DbCreateInterbranchtransferCommand", () => {
  let DbCreateInterbranchtransferCommand, dbCreateInterbranchtransfer;
  let sandbox,
    InterBranchTransferStub,
    ElasticIndexerStub,
    getInterBranchTransferByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getInterBranchTransferByIdStub = sandbox
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

    ({ DbCreateInterbranchtransferCommand, dbCreateInterbranchtransfer } =
      proxyquire(
        "../../../../src/db-layer/main/interBranchTransfer/dbCreateInterbranchtransfer",
        {
          models: { InterBranchTransfer: InterBranchTransferStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getInterBranchTransferById": getInterBranchTransferByIdStub,
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
      const cmd = new DbCreateInterbranchtransferCommand({});
      expect(cmd.commandName).to.equal("dbCreateInterbranchtransfer");
      expect(cmd.objectName).to.equal("interBranchTransfer");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getInterBranchTransferById and indexData", async () => {
      const cmd = new DbCreateInterbranchtransferCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getInterBranchTransferByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing interBranchTransfer if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockinterBranchTransfer = { update: updateStub, getData: () => ({ id: 2 }) };

      InterBranchTransferStub.findOne = sandbox.stub().resolves(mockinterBranchTransfer);
      InterBranchTransferStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          sourceBranchId: "sourceBranchId_value",
          
          destBranchId: "destBranchId_value",
          
          bookId: "bookId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateInterbranchtransferCommand(input);
      await cmd.runDbCommand();

      expect(input.interBranchTransfer).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new interBranchTransfer if no unique match is found", async () => {
      InterBranchTransferStub.findOne = sandbox.stub().resolves(null);
      InterBranchTransferStub.findByPk = sandbox.stub().resolves(null);
      InterBranchTransferStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          sourceBranchId: "sourceBranchId_value",
          
          destBranchId: "destBranchId_value",
          
          bookId: "bookId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateInterbranchtransferCommand(input);
      await cmd.runDbCommand();

      expect(input.interBranchTransfer).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(InterBranchTransferStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      InterBranchTransferStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateInterbranchtransferCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateInterbranchtransfer", () => {
    it("should execute successfully and return dbData", async () => {
      InterBranchTransferStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "interBranchTransfer" } };
      const result = await dbCreateInterbranchtransfer(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
