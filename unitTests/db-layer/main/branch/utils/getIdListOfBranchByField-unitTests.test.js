const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfBranchByField module", () => {
  let sandbox;
  let getIdListOfBranchByField;
  let BranchStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    BranchStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      name: "example-type",
    };

    getIdListOfBranchByField = proxyquire(
      "../../../../../src/db-layer/main/Branch/utils/getIdListOfBranchByField",
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

  describe("getIdListOfBranchByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      BranchStub["name"] = "string";
      const result = await getIdListOfBranchByField(
        "name",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(BranchStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      BranchStub["name"] = "string";
      const result = await getIdListOfBranchByField("name", "val", true);
      const call = BranchStub.findAll.getCall(0);
      expect(call.args[0].where["name"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfBranchByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      BranchStub["name"] = 123; // expects number

      try {
        await getIdListOfBranchByField("name", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      BranchStub.findAll.resolves([]);
      BranchStub["name"] = "string";

      try {
        await getIdListOfBranchByField("name", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Branch with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      BranchStub.findAll.rejects(new Error("query failed"));
      BranchStub["name"] = "string";

      try {
        await getIdListOfBranchByField("name", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
