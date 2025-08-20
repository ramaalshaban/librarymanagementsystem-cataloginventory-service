const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getBranchInventoryById module", () => {
  let sandbox;
  let getBranchInventoryById;
  let BranchInventoryStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test BranchInventory" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchInventoryStub = {
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

    getBranchInventoryById = proxyquire(
      "../../../../../src/db-layer/main/BranchInventory/utils/getBranchInventoryById",
      {
        models: { BranchInventory: BranchInventoryStub },
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

  describe("getBranchInventoryById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getBranchInventoryById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(BranchInventoryStub.findOne);
      sinon.assert.calledWith(
        BranchInventoryStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getBranchInventoryById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(BranchInventoryStub.findAll);
      sinon.assert.calledWithMatch(BranchInventoryStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      BranchInventoryStub.findOne.resolves(null);
      const result = await getBranchInventoryById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      BranchInventoryStub.findAll.resolves([]);
      const result = await getBranchInventoryById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      BranchInventoryStub.findOne.rejects(new Error("DB failure"));
      try {
        await getBranchInventoryById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchInventoryById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      BranchInventoryStub.findAll.rejects(new Error("array failure"));
      try {
        await getBranchInventoryById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingBranchInventoryById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      BranchInventoryStub.findOne.resolves({ getData: () => undefined });
      const result = await getBranchInventoryById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      BranchInventoryStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getBranchInventoryById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
