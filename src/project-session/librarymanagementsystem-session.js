const { NotAuthenticatedError, ForbiddenError } = require("common");
const { hexaLogger } = require("common");
const HexaAuth = require("./hexa-auth");

class LibrarymanagementsystemSession extends HexaAuth {
  constructor() {
    super();
    this.ROLES = {};

    this.projectName = "librarymanagementsystem";
    this.projectCodename = "librarymanagementsystem";
    this.isJWT = true;
    this.isJWTAuthRSA = true;
    this.isRemoteAuth = false;
    this.useRemoteSession = false;
  }
}

module.exports = LibrarymanagementsystemSession;
