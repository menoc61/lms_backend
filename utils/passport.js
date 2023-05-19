const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: "",
      clientSecret: "",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const data = profile?._json;
      const user = await User.findOne({ email: data.email });
      if (user) {
        return await cb(null, user);
      } else {
        const newUser = await User.create({
          firstname: data.firstname,
          lastname: data.given_name,
          user_image: data.picture,
          email: data.email,
          roles: "user",
        });
        return await cb(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
