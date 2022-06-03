const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        userid:{type:String},
    });

module.exports = mongoose.model('users',schema);