const { DB } = require("./database");
const keys = require("./config/keys");
const middlewares = {};

middlewares.isValidURL = (req, res, next) => {
  const url = req.body.url;

  if (url.length === 0)
    return res.status(400).send("Please first put your URL here.");

  // Function to validate url
  const validURL = str => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      str
    );
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
        URLId: result.id,
        realURL: result.real_url,
        shortenedURL: `${keys.domain}${result.shortened_url_id}`
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send("An unkown error ocurred.");
  }
};

middlewares.checkUrlOwnership = async (req, res, next) => {
  const urlId = req.params.id;
  const { user_id } = await DB.find(
    `SELECT user_id FROM urls WHERE id=${urlId}`
  );
  if (user_id === req.user.id) {
    next();
  } else {
    res.status(403);
  }
};

middlewares.requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).send({ message: "Unauthorized" });
  next();
};

module.exports = middlewares;
