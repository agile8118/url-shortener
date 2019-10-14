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
})

app.listen(port, () => {
  console.log("Server is on port " + port);
});
