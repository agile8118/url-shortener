const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const DB = require("./database");
const middlewares = require("./middlewares");

var app = express();

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2080;

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/url", middlewares.isValidURL, async (req, res) => {
  const realUrl = req.body.url;
  let urlId = (Math.floor(Math.random() * 90000) + 10000).toString();

  let url_ids = [];

  const shortened_url_ids = await DB.find("SELECT shortened_url_id FROM urls");

  shortened_url_ids.map(id => {
    url_ids.push(id.shortened_url_id);
  });

  while (url_ids.includes(urlId)) {
    urlId = Math.floor(Math.random() * 90000) + 10000;
  }

  await DB.insert("urls", { real_url: realUrl, shortened_url_id: urlId });

  return res.send({
    realURL: realUrl,
    shortenedURL: `https://shorter.guru/${urlId}`
  });
});

app.listen(port, () => {
  console.log("Server is on port " + port);
});
