const SlackStrategy = require('passport-slack-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const express = require('express');
const app = express();

const GOOGLE_CLIENT_ID = "478432334344-4lt057ldp3n45caff86f50v6kiuck031.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null,profile);
  }
));

const SLACK_CLIENT_ID = "90326783824.3568629353702";
const SLACK_CLIENT_SECRET = "0d836f5968b9b7fbc9bdaf6eadc6420e";
passport.use(new SlackStrategy({
    clientID: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET,
    skipUserProfile: false, 
    // scope: ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team'] 
    scope: ['identity.basic'] 

  },
  (accessToken, refreshToken, profile, done) => {
   
    done(null, profile);
  }
));

passport.serializeUser((user,done) => {
    done(null,user);
});
passport.deserializeUser((user,done) => {
    done(null,user);
});