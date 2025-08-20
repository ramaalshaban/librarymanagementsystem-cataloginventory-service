const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCatalogInventoryShareTokenListByQuery module", () => {
  let sandbox;
  let getCatalogInventoryShareTokenListByQuery;
  let CatalogInventoryShareTokenStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CatalogInventoryShareTokenStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getCatalogInventoryShareTokenListByQuery = proxyquire(
      "../../../../../src/db-layer/main/CatalogInventoryShareToken/utils/getCatalogInventoryShareTokenListByQuery",
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

  describe("getCatalogInventoryShareTokenListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getCatalogInventoryShareTokenListByQuery({
        isActive: true,
      });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.findAll);
      sinon.assert.calledWithMatch(CatalogInventoryShareTokenStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      CatalogInventoryShareTokenStub.findAll.resolves(null);

      const result = await getCatalogInventoryShareTokenListByQuery({
        active: false,
      });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      CatalogInventoryShareTokenStub.findAll.resolves([]);

      const result = await getCatalogInventoryShareTokenListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      CatalogInventoryShareTokenStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCatalogInventoryShareTokenListByQuery({
        active: true,
      });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCatalogInventoryShareTokenListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCatalogInventoryShareTokenListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      CatalogInventoryShareTokenStub.findAll.rejects(
        new Error("findAll failed"),
      );

      try {
        await getCatalogInventoryShareTokenListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCatalogInventoryShareTokenListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
