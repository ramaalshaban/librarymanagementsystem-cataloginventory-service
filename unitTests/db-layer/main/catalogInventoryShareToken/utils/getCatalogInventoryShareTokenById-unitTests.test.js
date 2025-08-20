const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCatalogInventoryShareTokenById module", () => {
  let sandbox;
  let getCatalogInventoryShareTokenById;
  let CatalogInventoryShareTokenStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CatalogInventoryShareToken" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CatalogInventoryShareTokenStub = {
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

    getCatalogInventoryShareTokenById = proxyquire(
      "../../../../../src/db-layer/main/CatalogInventoryShareToken/utils/getCatalogInventoryShareTokenById",
      {
        models: { CatalogInventoryShareToken: CatalogInventoryShareTokenStub },
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

  describe("getCatalogInventoryShareTokenById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCatalogInventoryShareTokenById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.findOne);
      sinon.assert.calledWith(
        CatalogInventoryShareTokenStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCatalogInventoryShareTokenById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.findAll);
      sinon.assert.calledWithMatch(CatalogInventoryShareTokenStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CatalogInventoryShareTokenStub.findOne.resolves(null);
      const result = await getCatalogInventoryShareTokenById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CatalogInventoryShareTokenStub.findAll.resolves([]);
      const result = await getCatalogInventoryShareTokenById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CatalogInventoryShareTokenStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCatalogInventoryShareTokenById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CatalogInventoryShareTokenStub.findAll.rejects(
        new Error("array failure"),
      );
      try {
        await getCatalogInventoryShareTokenById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CatalogInventoryShareTokenStub.findOne.resolves({
        getData: () => undefined,
      });
      const result = await getCatalogInventoryShareTokenById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CatalogInventoryShareTokenStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCatalogInventoryShareTokenById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
