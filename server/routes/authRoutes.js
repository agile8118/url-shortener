const passport = require("passport");

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
  app.post("/auth", (req, res) => {
    if (req.user) return res.send({ isSignedIn: true });
    res.send({ isSignedIn: false });
  });
};
