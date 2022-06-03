const express = require('express');
const router = express.Router();
const passport = require('passport');
const userdb = require('../models/users');

const CLIENT_URL = "https://localhost:3000/dashboard";

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
            const user = await userdb.create(req.body);
            res.status(200).json({user});
        }
    })
});

router.get("/google", passport.authenticate("google", {scope: ["profile"]}));
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed"
}),()=>console.log('failed'));
    
router.get('/slack', passport.authenticate('Slack'));
router.get('/slack/callback', passport.authenticate('Slack', {
    // successRedirect: CLIENT_URL, 
    failureRedirect: 'https://localhost:3000' 
}),()=>console.log('failed'));

module.exports = router;