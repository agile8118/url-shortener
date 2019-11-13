if (
  process.env.NODE_ENV === "production" ||
  (process.env.NODE_ENV === "test" && process.env.DOMAIN)
) {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
