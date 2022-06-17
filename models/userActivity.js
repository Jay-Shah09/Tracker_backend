const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        userid:{type:String},
        username:{type:String},
        status:{type:String},
        date_time:{type:String},
        userIP:{type:String},
        geolocation:{type:String},
    });

module.exports = mongoose.model('userActivity',schema);