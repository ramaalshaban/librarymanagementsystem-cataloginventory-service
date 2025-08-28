module.exports = {
  createSession: () => {
    const SessionManager = require("./librarymanagementsystem-session");
    return new SessionManager();
  },
};
