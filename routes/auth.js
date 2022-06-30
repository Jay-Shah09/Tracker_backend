const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();
const userdb = require('../models/users');
const activitydb = require('../models/userActivity');
const userchanneldb = require('../models/ChannelList');
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
    activitydb.find().then((response)=>{
      // while(!response.length <= 6) {
      //   response.shift();
      // }
      res.send(response);
    }).catch((err)=>console.log('something went wronggg'));
})
router.get('/getActivityDbData', (req,res)=>{
    activitydb.find().then((response)=>res.send(response)).catch((err)=>console.log('something went wrongg'));
})
router.post('/postMessages', async(req,res)=>{
  const {username, status, time, channelInfo} = req.body;
  const text = `${username} ${status} at ${time}`
  for(let i=0;i<channelInfo.length;i++) {    
    for(let key in channelInfo[i]) {
      if(key == 'channelid') {
        publishMessage(channelInfo[i][key] , text);
      }
    }
  }
})
async function findConversation(id) {
    try {
      const result = await client.conversations.list({
        token: process.env.SLACK_BOT_TOKEN,
        
      });
      for (const channel of result.channels) {
        if (channel.id === id) {
          return channel.name;
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  async function publishMessage(id, text) {
    try {
      const result = await client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: id,
        text: text,
      });
      // console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }

  router.post('/addchannel', async(req,res) => {
      userchanneldb.findOne({channelid: req.body.channelId}, async(err,result)=>{
        if(!result) {
          const channelName = await findConversation(req.body.channelId);
          const dataBody = {channelid: req.body.channelId, channelname: channelName}
          if(channelName) {
            await userchanneldb.create(dataBody);
          }
        }
        userchanneldb.find().then((response)=>res.send(response)).catch((err)=>console.log('something went wronggg'));
      });
  })
  router.get('/getchannelDbData', (req,res)=>{
    userchanneldb.find().then((response)=>res.send(response)).catch((err)=>console.log('something went wrongg'));
})
router.post('/deletechannel', async(req,res) => {
  await userchanneldb.findOneAndDelete({ _id: req.body.chid })
  await userchanneldb.find().then((response)=>{res.send(response)}).catch((err)=>console.log('something went wrongg'));
})

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