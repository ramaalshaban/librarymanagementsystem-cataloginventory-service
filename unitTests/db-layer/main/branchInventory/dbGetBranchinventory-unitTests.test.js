const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetBranchinventoryCommand is exported from main code

describe("DbGetBranchinventoryCommand", () => {
  let DbGetBranchinventoryCommand, dbGetBranchinventory;
  let sandbox, BranchInventoryStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.branchInventoryId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetBranchinventoryCommand, dbGetBranchinventory } = proxyquire(
      "../../../../src/db-layer/main/branchInventory/dbGetBranchinventory",
      {
        models: { BranchInventory: BranchInventoryStub },
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
      const cmd = new DbGetBranchinventoryCommand({});
      expect(cmd.commandName).to.equal("dbGetBranchinventory");
      expect(cmd.objectName).to.equal("branchInventory");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call BranchInventory.getCqrsJoins if exists", async () => {
      const cmd = new DbGetBranchinventoryCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(BranchInventoryStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete BranchInventoryStub.getCqrsJoins;
      const cmd = new DbGetBranchinventoryCommand({});
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
      const cmd = new DbGetBranchinventoryCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetBranchinventoryCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetBranchinventory", () => {
    it("should execute dbGetBranchinventory and return branchInventory data", async () => {
      const result = await dbGetBranchinventory({
        branchInventoryId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
