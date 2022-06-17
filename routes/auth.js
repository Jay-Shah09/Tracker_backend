const express = require('express');
const router = express.Router();
const passport = require('passport');
const userdb = require('../models/users');
const activitydb = require('../models/userActivity');
const app = express();
const { WebClient, LogLevel } = require("@slack/web-api");

const CLIENT_URL = "https://localhost:3000/dashboard";

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient("xoxb-90326783824-3669638917013-3YZ5A2SCkwo1tvcfrdu2v1sq", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

router.get("/login/failed", (req,res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    })
});
router.get("/login/success", (req,res) => {
    res.status(200).json({
        success: true,
        message: "successfullll",
        user: req.user,
    })
});
router.get("/logout", (req,res) => {
    req.logout();
    res.redirect("https://localhost:3000");
});
router.post('/addUser', (req,res) => {
    userdb.findOne({userid: req.body.userid}, async(err,result)=>{
        if(!result) {
            await userdb.create(req.body);
        }
        res.status(200).json({message:'authenticated'});
    })
});
router.post('/addUserActivity', async(req,res)=>{
    await activitydb.create(req.body);
    activitydb.find().then((response)=>res.send(response)).catch((err)=>console.log('something went wronggg'));
})
router.get('/getActivityDbData', async(req,res)=>{
    activitydb.find().then((response)=>res.send(response)).catch((err)=>console.log('something went wrongg'));
})
router.get('/getMessages', (req,res)=>{
    findConversation("tracker");
})
async function findConversation(name) {
    try {
      const result = await client.conversations.list({
        token: "xoxb-90326783824-3669638917013-3YZ5A2SCkwo1tvcfrdu2v1sq"
      });
      for (const channel of result.channels) {
        if (channel.name === name) {
          conversationId = channel.id;
          console.log("Found conversation ID: " + conversationId);
          console.log(channel);
          break;
        }
      }
    }
    catch (error) {
      console.error(error);
    }
    let conversationHistory;
    let channelId = "C03GYEJ34P4";
    
    try {
      const result = await client.conversations.history({
        channel: channelId
      });
    
      conversationHistory = result.messages;
    
      console.log(conversationHistory.length + " messages found in " + channelId);
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }

router.get("/google", passport.authenticate("google", {scope: ["profile"]}));
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed"
}),()=>console.log('failed'));
    
router.get('/slack', passport.authenticate('Slack'));
router.get('/slack/callback', passport.authenticate('Slack', {
    successRedirect: CLIENT_URL, 
    failureRedirect: 'https://localhost:3000' 
}),()=>console.log('failed'));

module.exports = router;