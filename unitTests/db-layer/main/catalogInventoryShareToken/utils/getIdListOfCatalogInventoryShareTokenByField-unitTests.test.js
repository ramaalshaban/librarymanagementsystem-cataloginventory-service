const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCatalogInventoryShareTokenByField module", () => {
  let sandbox;
  let getIdListOfCatalogInventoryShareTokenByField;
  let CatalogInventoryShareTokenStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CatalogInventoryShareTokenStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      configName: "example-type",
    };

    getIdListOfCatalogInventoryShareTokenByField = proxyquire(
      "../../../../../src/db-layer/main/CatalogInventoryShareToken/utils/getIdListOfCatalogInventoryShareTokenByField",
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
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfCatalogInventoryShareTokenByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CatalogInventoryShareTokenStub["configName"] = "string";
      const result = await getIdListOfCatalogInventoryShareTokenByField(
        "configName",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CatalogInventoryShareTokenStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CatalogInventoryShareTokenStub["configName"] = "string";
      const result = await getIdListOfCatalogInventoryShareTokenByField(
        "configName",
        "val",
        true,
      );
      const call = CatalogInventoryShareTokenStub.findAll.getCall(0);
      expect(call.args[0].where["configName"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCatalogInventoryShareTokenByField(
          "nonexistentField",
          "x",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CatalogInventoryShareTokenStub["configName"] = 123; // expects number

      try {
        await getIdListOfCatalogInventoryShareTokenByField(
          "configName",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      CatalogInventoryShareTokenStub.findAll.resolves([]);
      CatalogInventoryShareTokenStub["configName"] = "string";

      try {
        await getIdListOfCatalogInventoryShareTokenByField(
          "configName",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CatalogInventoryShareToken with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CatalogInventoryShareTokenStub.findAll.rejects(new Error("query failed"));
      CatalogInventoryShareTokenStub["configName"] = "string";

      try {
        await getIdListOfCatalogInventoryShareTokenByField(
          "configName",
          "test",
          false,
        );
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
