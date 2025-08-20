const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateCatalogInventoryShareTokenByQuery module", () => {
  let sandbox;
  let updateCatalogInventoryShareTokenByQuery;
  let CatalogInventoryShareTokenStub;

  const fakeQuery = { clientId: "abc123" };
  const fakeDataClause = { status: "archived" };
  const fakeUpdatedRows = [
    { getData: () => ({ id: "1", status: "archived" }) },
    { getData: () => ({ id: "2", status: "archived" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CatalogInventoryShareTokenStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateCatalogInventoryShareTokenByQuery = proxyquire(
      "../../../../../src/db-layer/main/CatalogInventoryShareToken/utils/updateCatalogInventoryShareTokenByQuery",
      {
        models: { CatalogInventoryShareToken: CatalogInventoryShareTokenStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(message, details) {
              super(message);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(message) {
              super(message);
              this.name = "BadRequestError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("updateCatalogInventoryShareTokenByQuery", () => {
    it("should update records matching query and return getData list", async () => {
      const result = await updateCatalogInventoryShareTokenByQuery(
        fakeDataClause,
        fakeQuery,
      );
      expect(result).to.deep.equal([
        { id: "1", status: "archived" },
        { id: "2", status: "archived" },
      ]);

      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.update);

      const [calledDataClause, calledOptions] =
        CatalogInventoryShareTokenStub.update.firstCall.args;

      expect(calledDataClause).to.deep.equal(fakeDataClause);
      expect(calledOptions.returning).to.be.true;

      expect(calledOptions.where).to.deep.equal({
        query: fakeQuery,
        isActive: true,
      });
    });

    it("should return [] if update returns no matching rows", async () => {
      CatalogInventoryShareTokenStub.update.resolves([0, []]);

      const result = await updateCatalogInventoryShareTokenByQuery(
        fakeDataClause,
        fakeQuery,
      );
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      CatalogInventoryShareTokenStub.update.resolves([
        2,
        [{ getData: () => undefined }, { getData: () => undefined }],
      ]);

      const result = await updateCatalogInventoryShareTokenByQuery(
        fakeDataClause,
        fakeQuery,
      );
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await updateCatalogInventoryShareTokenByQuery(
          fakeDataClause,
          undefined,
        );
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await updateCatalogInventoryShareTokenByQuery(
          fakeDataClause,
          "not-an-object",
        );
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if model update fails", async () => {
      CatalogInventoryShareTokenStub.update.rejects(new Error("update failed"));

      try {
        await updateCatalogInventoryShareTokenByQuery(
          fakeDataClause,
          fakeQuery,
        );
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenUpdatingCatalogInventoryShareTokenByQuery",
        );
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should accept empty dataClause and still process", async () => {
      CatalogInventoryShareTokenStub.update.resolves([0, []]);

      const result = await updateCatalogInventoryShareTokenByQuery(
        {},
        fakeQuery,
      );
      expect(result).to.deep.equal([]);
    });
  });
});
