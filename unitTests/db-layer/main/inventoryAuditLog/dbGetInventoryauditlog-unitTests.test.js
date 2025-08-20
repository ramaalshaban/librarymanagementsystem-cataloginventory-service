const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetInventoryauditlogCommand is exported from main code

describe("DbGetInventoryauditlogCommand", () => {
  let DbGetInventoryauditlogCommand, dbGetInventoryauditlog;
  let sandbox, InventoryAuditLogStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InventoryAuditLogStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.inventoryAuditLogId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetInventoryauditlogCommand, dbGetInventoryauditlog } = proxyquire(
      "../../../../src/db-layer/main/inventoryAuditLog/dbGetInventoryauditlog",
      {
        models: { InventoryAuditLog: InventoryAuditLogStub },
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
      const cmd = new DbGetInventoryauditlogCommand({});
      expect(cmd.commandName).to.equal("dbGetInventoryauditlog");
      expect(cmd.objectName).to.equal("inventoryAuditLog");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call InventoryAuditLog.getCqrsJoins if exists", async () => {
      const cmd = new DbGetInventoryauditlogCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(InventoryAuditLogStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete InventoryAuditLogStub.getCqrsJoins;
      const cmd = new DbGetInventoryauditlogCommand({});
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
      const cmd = new DbGetInventoryauditlogCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetInventoryauditlogCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetInventoryauditlog", () => {
    it("should execute dbGetInventoryauditlog and return inventoryAuditLog data", async () => {
      const result = await dbGetInventoryauditlog({
        inventoryAuditLogId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
