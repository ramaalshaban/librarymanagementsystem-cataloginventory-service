const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("CatalogInventoryServiceManager", () => {
  let CatalogInventoryServiceManager;
  let ApiManagerMock;

  beforeEach(() => {
    ApiManagerMock = class {
      constructor(req, opts) {
        this.request = req;
        this.options = opts;
        this.auth = req.auth;
      }

      parametersToJson(jsonObj) {
        jsonObj._base = true;
      }
    };

    CatalogInventoryServiceManager = proxyquire(
      "../../../src/manager-layer/service-manager/CatalogInventoryServiceManager",
      {
        "./ApiManager": ApiManagerMock,
      },
    );
  });

  describe("userHasRole()", () => {
    it("should return true if userHasRole returns true", () => {
      const req = {
        auth: {
          userHasRole: sinon.stub().withArgs("admin").returns(true),
        },
      };
      const manager = new CatalogInventoryServiceManager(req, {});
      expect(manager.userHasRole("admin")).to.be.true;
    });

    it("should return false if no auth", () => {
      const manager = new CatalogInventoryServiceManager({}, {});
      expect(manager.userHasRole("admin")).to.be.false;
    });
  });
});
