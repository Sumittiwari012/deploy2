require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require("nodemailer");
const AccountInfo = require('../models/accountinfo');
const ContactInfo = require('../models/contactinfo');
const PersonalInfo = require('../models/personal');
const HealthPreference = require('../models/healthpref');
const professional = require('../models/professional');

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "sumittiwari0258@gmail.com",
        pass: process.env.pass_key
    }
});
function sendmail(to, subject, msg) {
    transporter.sendMail({
        to: to,
        subject: subject,
        html: msg
    }, (error, info) => {
        if (error) {
            return console.log('Error sending email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
}

function sendOtp(email) {
    const otp = Math.floor(Math.random() * (10000 - 1000)) + 1000; // Generate a 4-digit OTP
    const subject = 'Your OTP Code';
    const message = `<p>Your OTP code is: <strong>${otp}</strong></p>`;
    sendmail(email, subject, message);
    console.log('Generated OTP:', otp);
    return otp;
}
// Session middleware (this should ideally be in app.js)
router.use(passport.initialize());
router.use(passport.session());

/* ---------------- GOOGLE STRATEGY ---------------- */
passport.use(new GoogleStrategy({
  clientID: process.env.google_client_id,
  clientSecret: process.env.google_client_secret,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true // required to access req.query.state
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const username = email.split('@')[0];
    const state = req.query.state; // 'login' or 'signup'
    const existingProf = await professional.findOne({ email });
    const existingUser = await AccountInfo.findOne({ email });

    if (state === 'login') {
      if (!existingUser) {
        return done(null, false, { message: "Email not found. Please sign up first." });
      }
      return done(null, existingUser,state);
    }

    if (state === 'signup') {
      if (existingUser) {
        return done(null, false, { message: "Email already registered. Please log in." });
      }

      // Create new user
      const newUser = await AccountInfo.create({
        email,
        username,
        password: '',
        authProvider: 'google'
      });

      await PersonalInfo.create({
        username,
        fullName: profile.displayName || '',
        dateOfBirth: '',
        gender: '',
        occupation: ''
      });

      await ContactInfo.create({
        username,
        phone: '',
        address: '',
        city: profile._json?.locale || '',
        state: '',
        zip: '',
        emergencyContact: { name: '', relation: '', phone: '' }
      });
      
      return done(null, newUser,state);
    }
    if (state === 'login-prof') {
      console.log(existingProf);
      if (!existingProf) {
        return done(null, false, { message: "Email not found. Please sign up first." });
      }
      return done(null, existingProf,state);
    }

    if (state === 'signup-prof') {
      if (existingProf) {
        return done(null, false, { message: "Email already registered. Please log in." });
      }

      // Create new user
      const newUser = await professional.create({
        email,
        username,
        password: '',
      });
      
      return done(null, newUser, state);
    }
    return done(null, false, { message: "Invalid request." });

  } catch (err) {
    console.error("Google Strategy Error:", err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  if (user && user.id) {
    done(null, user.id);
  } else {
    done(new Error('User object missing ID for session serialization'));
  }
});

passport.deserializeUser(async (id, done) => {
  console.log("id value")
  console.log(id);
  
  try {
    const user = await AccountInfo.findById(id);
    const prof = await professional.findById(id);
    if (!user && !prof) {
      return done(new Error('User not found during deserialization'), null);
    }
    if (user && !prof) {
      done(null, user);
    }
    if (!user && prof) {
      done(null, prof);
    }
    
  } catch (err) {
    done(err, null);
  }
});

/* ---------------- ROUTES ---------------- */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
      console.log(err);
      console.log(user);
      console.log(info);
    if (err || !user) {
      return res.send(`
        <script>
          alert("${info?.message || 'Google authentication failed.'}");
          window.location.href = "/login";
        </script>
      `);
    }

    req.logIn(user, (err) => {
      if (err) {
        
        console.error('Session error:', err);
        return res.redirect('/');
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        username: user.username
      };
      if (info === "login" || info === "signup") {
        return res.redirect('/userpage');
      } else if (info === "login-prof" || info === "signup-prof") {
        return res.redirect('/p_dashboard');
      }
    });
  })(req, res, next);
});
// Email/Password Login
// Login flow

router.get('/auth/google/login', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'login' // pass custom context
  })(req, res, next);
});

// Signup flow
router.get('/auth/google/signup', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'signup'
  })(req, res, next);
});

router.get('/auth/google/login_prof', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'login-prof' // pass custom context
  })(req, res, next);
});

// professional signup
router.get('/auth/google/signup_prof', (req, res, next) => {
  console.log("in the sign_prof sec");
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'signup-prof'
  })(req, res, next);
});
router.get('/change', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('change', { step: 'password', user: req.session.user });
});

// Handle password verification
router.post('/change/verify-password', async (req, res) => {
  const { password } = req.body;
  const user = await AccountInfo.findOne({ username: req.session.user.username });
  if (!user || user.password !== password) {
    return res.render('change', { step: 'password', error: 'Incorrect password' });
  }
  res.render('change', { step: 'confirm', email: user.email });
});

// Update email
router.post('/change/update-email', async (req, res) => {
  const { newEmail } = req.body;

  if (!req.session.user) return res.redirect('/login');

  try {
    const account = await AccountInfo.findOne({ username: req.session.user.username });

    if (!account) {
      return res.status(404).send("User not found.");
    }

    if (account.email === newEmail) {
      // Email is the same, stay on the same page with a message
      return res.render('change-email', {
        step: 'confirm',
        email: account.email,
        error: "The new email is the same as the current one. Please enter a different email."
      });
    }

    // Update email and reset verification
    await AccountInfo.findOneAndUpdate(
      { username: req.session.user.username },
      { email: newEmail }
    );

    await ContactInfo.findOneAndUpdate(
      { username: req.session.user.username },
      { $set: { emailVerified: false } }
    );

    // TODO: Send verification email here

    res.redirect("/userpage");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get('/set-password', (req, res) => {
   if (!req.session.user) return res.redirect('/login');
  res.render('set-password');
});

router.post('/verify-user', async (req, res) => {
  console.log("in verify-user");
  const { username, email } = req.body;
  const user = await AccountInfo.findOne({ username, email });
  if (user) {
    if (!req.session.user) {
      req.session.user = {};
    }
    // You might store verified username/email in session
    req.session.user.username = username;
    res.redirect("/set-password");
  } else {
    return res.status(404).send(); // Not found
  }
});


router.post('/set-password', async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (!req.session.user) return res.redirect('/login');

  if (password !== confirmPassword) {
    return res.render('set-password', { error: "Passwords do not match." });
  }

  try {
    await AccountInfo.findOneAndUpdate(
      { username: req.session.user.username },
      { $set: { password: password } }
    );
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

router.get('/verify', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {
    const username = req.session.user.username;
    const account = await AccountInfo.findOne({ username });
    const contact = await ContactInfo.findOne({ username });

    const user = {
      email: account?.email || '',
      phone: contact?.phone || '',
      emailVerified: contact?.emailVerified || '',
      phoneVerified: contact?.phoneVerified || ''
    };
    console.log(user);
    res.render('verify', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/verify/send-email-otp', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {

    const email = req.session.user.email;
    const otp= sendOtp(email);
    req.session.user.emailotp=otp;
    console.log(req.session.user.emailotp);
    res.redirect('/verify');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
router.post('/verify/confirm-email-otp', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {
    console.log(req.session.user);
    if(req.session.user.emailotp==req.body.emailOTP){
        console.log("verified");
        const updatedContact = await ContactInfo.findOneAndUpdate(
        { username: req.session.user.username },
        { $set: { emailVerified: true } }
      );
      console.log(updatedContact);
        
        res.redirect('/verify');
    }
    else{
      `<script>
          alert("please enter correct otp");
          window.location.href = "/verify";
        </script>`
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login - Mental Health App' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await AccountInfo.findOne({ email });

    if (!account || account.password !== password) {
      return res.status(401).send('<h3>Invalid credentials. <a href="/login">Try again</a></h3>');
    }

    req.session.user = {
      id: account._id,
      email: account.email,
      username: account.username
    };

    res.redirect('/userpage');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Signup Page
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up - Mental Health App' });
});

router.post('/signup', async (req, res) => {
  try {
    const { email, username } = req.body;

    const existingEmail = await AccountInfo.findOne({ email });
    if (existingEmail) {
      return res.send(`
        <script>
          alert("This email is already registered. Please login instead.");
          window.location.href = "/signup";
        </script>
      `);
    }

    const existingUsername = await AccountInfo.findOne({ username });
    if (existingUsername) {
      return res.send(`
        <script>
          alert("This username is already taken. Please choose a different username.");
          window.location.href = "/signup";
        </script>
      `);
    }

    // If not registered, proceed with signup
    const personal = await PersonalInfo.create({
      username: username,
      fullName: req.body.fullname,
      dateOfBirth: req.body.dob,
      gender: req.body.gender,
      country: req.body.country,
      bio: req.body.bio
    });

    const contact = await ContactInfo.create({
      username: username,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
    });

    const account = await AccountInfo.create({
      email: email,
      username: username,
      password: req.body.password,
      authProvider: req.body.authProvider || 'local'
    });

    const health = await HealthPreference.create({
      username: username,
      hasPreviousTherapy: req.body.hasPreviousTherapy === 'true',
      hasMentalHealthCondition: req.body.hasMentalHealthCondition === 'true',
      conditionDetails: req.body.conditionDetails,
      therapyType: req.body.therapyType?.split(',').map(t => t.trim()),
      communicationMode: req.body.communicationMode?.split(',').map(m => m.trim()),
      goals: req.body.goals,
      preferredLanguage: req.body.preferredLanguage
    });

    req.session.user = {
      username: account.username
    };

    res.redirect('/userpage');
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).send('Server error. Try again.');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).send('Logout failed.');
    }
    res.redirect('/');
  });
});
// from here the 
module.exports = router;
