const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetInterbranchtransferCommand is exported from main code

describe("DbGetInterbranchtransferCommand", () => {
  let DbGetInterbranchtransferCommand, dbGetInterbranchtransfer;
  let sandbox, InterBranchTransferStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.interBranchTransferId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetInterbranchtransferCommand, dbGetInterbranchtransfer } = proxyquire(
      "../../../../src/db-layer/main/interBranchTransfer/dbGetInterbranchtransfer",
      {
        models: { InterBranchTransfer: InterBranchTransferStub },
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
      const cmd = new DbGetInterbranchtransferCommand({});
      expect(cmd.commandName).to.equal("dbGetInterbranchtransfer");
      expect(cmd.objectName).to.equal("interBranchTransfer");
      expect(cmd.serviceLabel).to.equal(
        "librarymanagementsystem-cataloginventory-service",
      );
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call InterBranchTransfer.getCqrsJoins if exists", async () => {
      const cmd = new DbGetInterbranchtransferCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(InterBranchTransferStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete InterBranchTransferStub.getCqrsJoins;
      const cmd = new DbGetInterbranchtransferCommand({});
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
      const cmd = new DbGetInterbranchtransferCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetInterbranchtransferCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetInterbranchtransfer", () => {
    it("should execute dbGetInterbranchtransfer and return interBranchTransfer data", async () => {
      const result = await dbGetInterbranchtransfer({
        interBranchTransferId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
