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

module.exports = middlewares;
