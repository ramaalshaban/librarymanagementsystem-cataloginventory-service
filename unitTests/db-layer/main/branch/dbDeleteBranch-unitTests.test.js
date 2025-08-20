const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteBranchCommand is exported from main code

describe("DbDeleteBranchCommand", () => {
  let DbDeleteBranchCommand, dbDeleteBranch;
  let sandbox,
    BranchStub,
    getBranchByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {};

    getBranchByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.branchId || 123 };
        this.dbInstance = null;
      }

      loadHookFunctions() {}
      initOwnership() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbDeleteBranchCommand, dbDeleteBranch } = proxyquire(
      "../../../../src/db-layer/main/branch/dbDeleteBranch",
      {
        models: { Branch: BranchStub },
        "./query-cache-classes": {
          BranchQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getBranchById": getBranchByIdStub,
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        dbCommand: {
          DBSoftDeleteSequelizeCommand: BaseCommandStub,
        },
        common: {
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
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
      const cmd = new DbDeleteBranchCommand({});
      expect(cmd.commandName).to.equal("dbDeleteBranch");
      expect(cmd.objectName).to.equal("branch");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-branch-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteBranchCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteBranch", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getBranchByIdStub.resolves(mockInstance);

      const input = {
        branchId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteBranch(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
