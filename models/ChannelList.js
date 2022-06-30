const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        channelid:{type:String},
        channelname:{type:String},
    });

module.exports = mongoose.model('ChannelList',schema);