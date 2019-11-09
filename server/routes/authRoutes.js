const passport = require("passport");
const { DB } = require("../database");

module.exports = app => {
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

  // Check to see if a user is logged in or not
  app.post("/auth", async (req, res) => {
    if (req.user) {
      const { email } = await DB.find(
        `SELECT email FROM users WHERE id=${req.user.id}`
      );
      return res.send({ isSignedIn: true, email });
    }
    res.send({ isSignedIn: false });
  });
};
