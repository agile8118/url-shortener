const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

var app = express();

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2080;

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/url", (req, res) => {
  const realUrl = req.body.url;
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

  if (realUrl.length === 0)
    return res.status(400).send("Please first put your URL here.");
  if (validURL(realUrl)) {
    return res.send({
      realURL: realUrl,
      shortenedURL: "https://shorter.guru/456123"
    });
  } else {
    return res.status(400).send("The URL you put is not valid.");
  }
});

app.listen(port, () => {
  console.log("Server is on port " + port);
});
