var mongoose = require('mongoose');

var Record = new mongoose.Schema({
    timestamp:String,
    totalcal:Number,
    totalfat:Number,
    totalcarbs:Number,
    totalprot:Number,
    cigsmoke:Number,
    alcoholglass:Number,
    calburnt:Number
});

module.exports = mongoose.model('Record', Record);