const util = {};

util.isValidUrlId = id => {
  if (id.toString().length === 6) return true;
  return false;
};

module.exports = util;
