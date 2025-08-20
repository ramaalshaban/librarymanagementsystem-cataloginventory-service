const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfInterBranchTransferByField module", () => {
  let sandbox;
  let getIdListOfInterBranchTransferByField;
  let InterBranchTransferStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    InterBranchTransferStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      bookId: "example-type",
    };

    getIdListOfInterBranchTransferByField = proxyquire(
      "../../../../../src/db-layer/main/InterBranchTransfer/utils/getIdListOfInterBranchTransferByField",
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

  describe("getIdListOfInterBranchTransferByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      InterBranchTransferStub["bookId"] = "string";
      const result = await getIdListOfInterBranchTransferByField(
        "bookId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(InterBranchTransferStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      InterBranchTransferStub["bookId"] = "string";
      const result = await getIdListOfInterBranchTransferByField(
        "bookId",
        "val",
        true,
      );
      const call = InterBranchTransferStub.findAll.getCall(0);
      expect(call.args[0].where["bookId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfInterBranchTransferByField(
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
      InterBranchTransferStub["bookId"] = 123; // expects number

      try {
        await getIdListOfInterBranchTransferByField(
          "bookId",
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
      InterBranchTransferStub.findAll.resolves([]);
      InterBranchTransferStub["bookId"] = "string";

      try {
        await getIdListOfInterBranchTransferByField("bookId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "InterBranchTransfer with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      InterBranchTransferStub.findAll.rejects(new Error("query failed"));
      InterBranchTransferStub["bookId"] = "string";

      try {
        await getIdListOfInterBranchTransferByField("bookId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
