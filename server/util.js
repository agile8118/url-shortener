const util = {};

util.isValidUrlId = id => {
  if (typeof id === "number" && id.toString().length === 6) return true;
  return false;
};

module.exports = util;
