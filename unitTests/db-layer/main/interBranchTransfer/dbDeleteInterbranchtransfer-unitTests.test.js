const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteInterbranchtransferCommand is exported from main code

describe("DbDeleteInterbranchtransferCommand", () => {
  let DbDeleteInterbranchtransferCommand, dbDeleteInterbranchtransfer;
  let sandbox,
    InterBranchTransferStub,
    getInterBranchTransferByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {};

    getInterBranchTransferByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.interBranchTransferId || 123 };
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

    ({ DbDeleteInterbranchtransferCommand, dbDeleteInterbranchtransfer } =
      proxyquire(
        "../../../../src/db-layer/main/interBranchTransfer/dbDeleteInterbranchtransfer",
        {
          models: { InterBranchTransfer: InterBranchTransferStub },
          "./query-cache-classes": {
            InterBranchTransferQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getInterBranchTransferById": getInterBranchTransferByIdStub,
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
      const cmd = new DbDeleteInterbranchtransferCommand({});
      expect(cmd.commandName).to.equal("dbDeleteInterbranchtransfer");
      expect(cmd.objectName).to.equal("interBranchTransfer");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-interbranchtransfer-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteInterbranchtransferCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteInterbranchtransfer", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getInterBranchTransferByIdStub.resolves(mockInstance);

      const input = {
        interBranchTransferId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteInterbranchtransfer(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
