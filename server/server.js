const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const DB = require("./database");
const middlewares = require("./middlewares");
const keys = require("./config/keys");
require("./passport");

var app = express();

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 2080;

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

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

app.listen(port, () => {
  console.log("Server is on port " + port);
});
