const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCatalogInventoryShareTokenByQuery module", () => {
  let sandbox;
  let getCatalogInventoryShareTokenByQuery;
  let CatalogInventoryShareTokenStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CatalogInventoryShareToken",
    getData: () => ({ id: fakeId, name: "Test CatalogInventoryShareToken" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CatalogInventoryShareTokenStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCatalogInventoryShareTokenByQuery = proxyquire(
      "../../../../../src/db-layer/main/CatalogInventoryShareToken/utils/getCatalogInventoryShareTokenByQuery",
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
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCatalogInventoryShareTokenByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCatalogInventoryShareTokenByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CatalogInventoryShareToken",
      });
      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.findOne);
      sinon.assert.calledWith(CatalogInventoryShareTokenStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CatalogInventoryShareTokenStub.findOne.resolves(null);

      const result = await getCatalogInventoryShareTokenByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCatalogInventoryShareTokenByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCatalogInventoryShareTokenByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CatalogInventoryShareTokenStub.findOne.rejects(
        new Error("findOne failed"),
      );

      try {
        await getCatalogInventoryShareTokenByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CatalogInventoryShareTokenStub.findOne.resolves({
        getData: () => undefined,
      });

      const result = await getCatalogInventoryShareTokenByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
