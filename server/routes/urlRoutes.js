const { DB } = require("../database");
const middlewares = require("../middlewares");
const keys = require("../config/keys");

module.exports = app => {
  // Show the home page
  app.get("/", (req, res) => {
    res.render("index.html");
  });

  // Get the url, shorten it and save to database
  app.post(
    "/url",
    middlewares.isValidURL,
    middlewares.checkRealUrlExistence,
    async (req, res) => {
      const realUrl = req.body.url;
      // Generate a 6 digts number to be used as url shortened id
      let urlId = (Math.floor(Math.random() * 90000) + 10000).toString();

      let url_ids = [];

      const shortened_url_ids = await DB.find(
        "SELECT shortened_url_id FROM urls"
      );

      if (shortened_url_ids[0]) {
        shortened_url_ids.map(id => {
          url_ids.push(id.shortened_url_id);
        });
      } else {
        url_ids.push(shortened_url_ids.shortened_url_id);
      }

      while (url_ids.includes(urlId)) {
        urlId = Math.floor(Math.random() * 90000) + 10000;
      }

      // Insert a new record to url table
      await DB.insert("urls", { real_url: realUrl, shortened_url_id: urlId });
      return res.send({
        realURL: realUrl,
        shortenedURL: `${keys.domain}${urlId}`
      });
    }
  );

  // Redirect to the real url
  app.get("/:id", async (req, res) => {
    const { real_url, id } = await DB.find(
      `SELECT real_url, id FROM urls WHERE shortened_url_id=${req.params.id}`
    );

    // Increment the views number by one
    await DB.update(`UPDATE urls SET views = views + 1 WHERE id = ?`, [id]);

    res.redirect(real_url);
  });
};
