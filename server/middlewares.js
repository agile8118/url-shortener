const { DB } = require("./database");
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

// We don't want duplicated urls for a specified user
middlewares.checkRealUrlExistence = async (req, res, next) => {
  try {
    // Get the user id if the use is logged in
    let userId = req.user ? req.user.id : null;

    const realUrl = req.body.url;
    let result;
    if (userId) {
      result = await DB.find(
        `SELECT * FROM urls WHERE real_url = '${realUrl}' AND user_id = '${userId}'`
      );
    } else {
      result = await DB.find(
        `SELECT * FROM urls WHERE real_url = '${realUrl}' AND user_id IS NULL`
      );
    }

    if (result.id) {
      res.status(200).send({
        realURL: result.real_url,
        shortenedURL: `${keys.domain}${result.shortened_url_id}`
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An unkown error ocurred.");
  }
};

module.exports = middlewares;
