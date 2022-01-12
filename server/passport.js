const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { DB } = require("./database");
const keys = require("./config/keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = { id };
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: `${keys.domain}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const userName = profile._json.name;
      const userEmail = profile._json.email;

      const { id } = await DB.find(
        `SELECT id FROM users WHERE google_id=${googleId}`
      );
      if (id) {
        // Login user
        const user = { id };
        done(null, user);
      } else {
        // Create the user
        const id = await DB.insert("users", {
          email: userEmail,
          name: userName,
          google_id: googleId,
        });
        const user = { id };
        done(null, user);
      }
    }
  )
);
