const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetBranchCommand is exported from main code

describe("DbGetBranchCommand", () => {
  let DbGetBranchCommand, dbGetBranch;
  let sandbox, BranchStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.branchId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetBranchCommand, dbGetBranch } = proxyquire(
      "../../../../src/db-layer/main/branch/dbGetBranch",
      {
        models: { Branch: BranchStub },
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
      const cmd = new DbGetBranchCommand({});
      expect(cmd.commandName).to.equal("dbGetBranch");
      expect(cmd.objectName).to.equal("branch");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Branch.getCqrsJoins if exists", async () => {
      const cmd = new DbGetBranchCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(BranchStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete BranchStub.getCqrsJoins;
      const cmd = new DbGetBranchCommand({});
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
      const cmd = new DbGetBranchCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetBranchCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetBranch", () => {
    it("should execute dbGetBranch and return branch data", async () => {
      const result = await dbGetBranch({
        branchId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
