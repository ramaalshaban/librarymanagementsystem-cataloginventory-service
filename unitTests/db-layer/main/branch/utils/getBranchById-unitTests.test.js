const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getBranchById module", () => {
  let sandbox;
  let getBranchById;
  let BranchStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Branch" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {
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

    getBranchById = proxyquire(
      "../../../../../src/db-layer/main/Branch/utils/getBranchById",
      {
        models: { Branch: BranchStub },
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

  describe("getBranchById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getBranchById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(BranchStub.findOne);
      sinon.assert.calledWith(
        BranchStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getBranchById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(BranchStub.findAll);
      sinon.assert.calledWithMatch(BranchStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      BranchStub.findOne.resolves(null);
      const result = await getBranchById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      BranchStub.findAll.resolves([]);
      const result = await getBranchById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      BranchStub.findOne.rejects(new Error("DB failure"));
      try {
        await getBranchById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBranchById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      BranchStub.findAll.rejects(new Error("array failure"));
      try {
        await getBranchById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingBranchById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      BranchStub.findOne.resolves({ getData: () => undefined });
      const result = await getBranchById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      BranchStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getBranchById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
