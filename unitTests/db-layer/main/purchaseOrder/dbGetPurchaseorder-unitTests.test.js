const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetPurchaseorderCommand is exported from main code

describe("DbGetPurchaseorderCommand", () => {
  let DbGetPurchaseorderCommand, dbGetPurchaseorder;
  let sandbox, PurchaseOrderStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PurchaseOrderStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.purchaseOrderId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetPurchaseorderCommand, dbGetPurchaseorder } = proxyquire(
      "../../../../src/db-layer/main/purchaseOrder/dbGetPurchaseorder",
      {
        models: { PurchaseOrder: PurchaseOrderStub },
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
      const cmd = new DbGetPurchaseorderCommand({});
      expect(cmd.commandName).to.equal("dbGetPurchaseorder");
      expect(cmd.objectName).to.equal("purchaseOrder");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call PurchaseOrder.getCqrsJoins if exists", async () => {
      const cmd = new DbGetPurchaseorderCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(PurchaseOrderStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete PurchaseOrderStub.getCqrsJoins;
      const cmd = new DbGetPurchaseorderCommand({});
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
      const cmd = new DbGetPurchaseorderCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetPurchaseorderCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetPurchaseorder", () => {
    it("should execute dbGetPurchaseorder and return purchaseOrder data", async () => {
      const result = await dbGetPurchaseorder({
        purchaseOrderId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
