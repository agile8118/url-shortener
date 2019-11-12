const { DB } = require("../database");
const middlewares = require("../middlewares");
const keys = require("../config/keys");

module.exports = app => {
  // Show the home page
  app.get("/", (req, res) => {
    res.render("index.html");
  });

  app.get("/url", middlewares.requireAuth, async (req, res) => {
    let data = await DB.find(
      `SELECT real_url, shortened_url_id, id FROM urls WHERE user_id=${req.user.id} ORDER BY created_at DESC`
    );

    // If there's only one url
    if (!data.length && data.length !== 0) {
      // Create a new arr with the object if we have only one record
      let arr = [];
      arr.push(data);
      res.send({
        urls: arr,
        domain: keys.domain
      });
      // If there is no url
    } else if (data.length === 0) {
      res.send({
        urls: [],
        domain: keys.domain
      });
      // If there are more than one url
    } else {
      res.send({
        urls: data,
        domain: keys.domain
      });
    }
  });

  // Get the url, shorten it and save to database
  app.post(
    "/url",
    middlewares.isValidURL,
    middlewares.checkRealUrlExistence,
    async (req, res) => {
      // Get the user id if the use is logged in
      let userId = req.user ? req.user.id : null;

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
      let insertedData = null;
      if (userId) {
        insertedData = await DB.insert("urls", {
          real_url: realUrl,
          shortened_url_id: urlId,
          user_id: userId
        });
      } else {
        await DB.insert("urls", { real_url: realUrl, shortened_url_id: urlId });
      }

      return res.send({
        URLId: insertedData,
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

  // Delete an url record
  app.delete(
    "/url/:id",
    middlewares.requireAuth,
    middlewares.checkUrlOwnership,
    async (req, res) => {
      await DB.delete(`DELETE FROM urls WHERE id=${req.params.id}`);
      res.send({ message: "deleted" });
    }
  );
};
