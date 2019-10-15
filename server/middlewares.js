const DB = require("./database");
const keys = require("./config/keys");
const middlewares = {};

middlewares.isValidURL = (req, res, next) => {
  const url = req.body.url;

  if (url.length === 0)
    return res.status(400).send("Please first put your URL here.");

  // Function to validate url
  const validURL = str => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  if (validURL(url)) {
    next();
  } else {
    return res.status(400).send("The URL you put is not valid.");
  }
};

middlewares.checkRealUrlExistence = async (req, res, next) => {
  try {
    const realUrl = req.body.url;
    const result = await DB.find(
      `select * from urls where real_url = '${realUrl}'`
    );

    if (result.length > 0) {
      return res.send({
        realURL: result[0].real_url,
        shortenedURL: `${keys.domain}${result[0].shortened_url_id}`
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send("An unkown error ocurred.");
  }
};

module.exports = middlewares;
