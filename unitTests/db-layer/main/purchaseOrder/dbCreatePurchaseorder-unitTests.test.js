const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreatePurchaseorderCommand is exported from main code
describe("DbCreatePurchaseorderCommand", () => {
  let DbCreatePurchaseorderCommand, dbCreatePurchaseorder;
  let sandbox,
    PurchaseOrderStub,
    ElasticIndexerStub,
    getPurchaseOrderByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getPurchaseOrderByIdStub = sandbox
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

    ({ DbCreatePurchaseorderCommand, dbCreatePurchaseorder } = proxyquire(
      "../../../../src/db-layer/main/purchaseOrder/dbCreatePurchaseorder",
      {
        models: { PurchaseOrder: PurchaseOrderStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getPurchaseOrderById": getPurchaseOrderByIdStub,
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
      const cmd = new DbCreatePurchaseorderCommand({});
      expect(cmd.commandName).to.equal("dbCreatePurchaseorder");
      expect(cmd.objectName).to.equal("purchaseOrder");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-purchaseorder-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getPurchaseOrderById and indexData", async () => {
      const cmd = new DbCreatePurchaseorderCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getPurchaseOrderByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing purchaseOrder if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockpurchaseOrder = { update: updateStub, getData: () => ({ id: 2 }) };

      PurchaseOrderStub.findOne = sandbox.stub().resolves(mockpurchaseOrder);
      PurchaseOrderStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          branchId: "branchId_value",
          
          status: "status_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreatePurchaseorderCommand(input);
      await cmd.runDbCommand();

      expect(input.purchaseOrder).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new purchaseOrder if no unique match is found", async () => {
      PurchaseOrderStub.findOne = sandbox.stub().resolves(null);
      PurchaseOrderStub.findByPk = sandbox.stub().resolves(null);
      PurchaseOrderStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          branchId: "branchId_value",
          
          status: "status_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreatePurchaseorderCommand(input);
      await cmd.runDbCommand();

      expect(input.purchaseOrder).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(PurchaseOrderStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      PurchaseOrderStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreatePurchaseorderCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreatePurchaseorder", () => {
    it("should execute successfully and return dbData", async () => {
      PurchaseOrderStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "purchaseOrder" } };
      const result = await dbCreatePurchaseorder(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
