const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getInterBranchTransferById module", () => {
  let sandbox;
  let getInterBranchTransferById;
  let InterBranchTransferStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test InterBranchTransfer" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getInterBranchTransferById = proxyquire(
      "../../../../../src/db-layer/main/InterBranchTransfer/utils/getInterBranchTransferById",
      {
        models: { InterBranchTransfer: InterBranchTransferStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getInterBranchTransferById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getInterBranchTransferById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(InterBranchTransferStub.findOne);
      sinon.assert.calledWith(
        InterBranchTransferStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getInterBranchTransferById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(InterBranchTransferStub.findAll);
      sinon.assert.calledWithMatch(InterBranchTransferStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      InterBranchTransferStub.findOne.resolves(null);
      const result = await getInterBranchTransferById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      InterBranchTransferStub.findAll.resolves([]);
      const result = await getInterBranchTransferById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      InterBranchTransferStub.findOne.rejects(new Error("DB failure"));
      try {
        await getInterBranchTransferById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInterBranchTransferById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      InterBranchTransferStub.findAll.rejects(new Error("array failure"));
      try {
        await getInterBranchTransferById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingInterBranchTransferById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      InterBranchTransferStub.findOne.resolves({ getData: () => undefined });
      const result = await getInterBranchTransferById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      InterBranchTransferStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getInterBranchTransferById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
