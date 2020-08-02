const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const compression = require("compression");
const helmet = require("helmet");
const log = require("./lib/log");
const keys = require("./config/keys");
require("./passport");

const app = express();
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 2080;

app.use(helmet());
app.use(compression());
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

app.use((req, res, next) => {
  const requestStart = Date.now();
  // Grab requester ip address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Once the request is finished
  res.on("finish", () => {
    // Get req status code and message
    const { statusCode, statusMessage } = res;
    // Calculate how much it took the request to finish
    const processingTime = Date.now() - requestStart;

    // Format the log message and send it to log function
    log(
      ip +
        " -- " +
        req.method +
        " " +
        req.originalUrl +
        " " +
        statusCode +
        " " +
        statusMessage +
        " -- response-time: " +
        processingTime +
        " ms"
    );
  });
  next();
});

// Show the home page
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/../public" });
});

// Routes
require("./routes/authRoutes")(app);
require("./routes/urlRoutes")(app);

// Send 404 page
app.get("*", (req, res) => {
  res.sendFile("404.html", { root: __dirname + "/../public" });
});

const server = app.listen(port, () => {
  log(
    "Starting the server..." +
      "\n----------------------------------\n" +
      "Server has started on port " +
      port +
      "\n----------------------------------"
  );
  console.log("Server is on port " + port);
});

// Export the server for testing
module.exports = { app, server };
