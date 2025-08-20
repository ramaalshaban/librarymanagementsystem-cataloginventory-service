const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteBranchinventoryCommand is exported from main code

describe("DbDeleteBranchinventoryCommand", () => {
  let DbDeleteBranchinventoryCommand, dbDeleteBranchinventory;
  let sandbox,
    BranchInventoryStub,
    getBranchInventoryByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {};

    getBranchInventoryByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.branchInventoryId || 123 };
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

    ({ DbDeleteBranchinventoryCommand, dbDeleteBranchinventory } = proxyquire(
      "../../../../src/db-layer/main/branchInventory/dbDeleteBranchinventory",
      {
        models: { BranchInventory: BranchInventoryStub },
        "./query-cache-classes": {
          BranchInventoryQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getBranchInventoryById": getBranchInventoryByIdStub,
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
      const cmd = new DbDeleteBranchinventoryCommand({});
      expect(cmd.commandName).to.equal("dbDeleteBranchinventory");
      expect(cmd.objectName).to.equal("branchInventory");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-branchinventory-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteBranchinventoryCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteBranchinventory", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getBranchInventoryByIdStub.resolves(mockInstance);

      const input = {
        branchInventoryId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteBranchinventory(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
