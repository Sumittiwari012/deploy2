const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AccountInfo = require('../models/accountinfo');
const ContactInfo = require('../models/contactinfo');
const PersonalInfo = require('../models/personal');

passport.use(new GoogleStrategy({
  clientID: process.env.google_client_id,
  clientSecret: process.env.google_client_secret,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const username = email.split('@')[0];
    const state = req.query.state;

    const existingUser = await AccountInfo.findOne({ email });

    if (state === 'login') {
      if (!existingUser) return done(null, false, { message: "Email not found." });
      return done(null, existingUser);
    }

    if (state === 'signup') {
      if (existingUser) return done(null, false, { message: "Already registered." });

      const newUser = await AccountInfo.create({ email, username, password: '', authProvider: 'google' });
      await PersonalInfo.create({ username, fullName: profile.displayName });
      await ContactInfo.create({ username, city: profile._json?.locale });

      return done(null, newUser);
    }

    return done(null, false, { message: "Invalid request." });

  } catch (err) {
    console.error("Google Strategy Error:", err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await AccountInfo.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
