const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateInventoryauditlogCommand is exported from main code
describe("DbCreateInventoryauditlogCommand", () => {
  let DbCreateInventoryauditlogCommand, dbCreateInventoryauditlog;
  let sandbox,
    InventoryAuditLogStub,
    ElasticIndexerStub,
    getInventoryAuditLogByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InventoryAuditLogStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getInventoryAuditLogByIdStub = sandbox
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

    ({ DbCreateInventoryauditlogCommand, dbCreateInventoryauditlog } =
      proxyquire(
        "../../../../src/db-layer/main/inventoryAuditLog/dbCreateInventoryauditlog",
        {
          models: { InventoryAuditLog: InventoryAuditLogStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getInventoryAuditLogById": getInventoryAuditLogByIdStub,
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
      const cmd = new DbCreateInventoryauditlogCommand({});
      expect(cmd.commandName).to.equal("dbCreateInventoryauditlog");
      expect(cmd.objectName).to.equal("inventoryAuditLog");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-cataloginventory-service-dbevent-inventoryauditlog-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getInventoryAuditLogById and indexData", async () => {
      const cmd = new DbCreateInventoryauditlogCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getInventoryAuditLogByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing inventoryAuditLog if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockinventoryAuditLog = { update: updateStub, getData: () => ({ id: 2 }) };

      InventoryAuditLogStub.findOne = sandbox.stub().resolves(mockinventoryAuditLog);
      InventoryAuditLogStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          branchId: "branchId_value",
          
          branchInventoryId: "branchInventoryId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateInventoryauditlogCommand(input);
      await cmd.runDbCommand();

      expect(input.inventoryAuditLog).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new inventoryAuditLog if no unique match is found", async () => {
      InventoryAuditLogStub.findOne = sandbox.stub().resolves(null);
      InventoryAuditLogStub.findByPk = sandbox.stub().resolves(null);
      InventoryAuditLogStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          branchId: "branchId_value",
          
          branchInventoryId: "branchInventoryId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateInventoryauditlogCommand(input);
      await cmd.runDbCommand();

      expect(input.inventoryAuditLog).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(InventoryAuditLogStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      InventoryAuditLogStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateInventoryauditlogCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateInventoryauditlog", () => {
    it("should execute successfully and return dbData", async () => {
      InventoryAuditLogStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "inventoryAuditLog" } };
      const result = await dbCreateInventoryauditlog(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
