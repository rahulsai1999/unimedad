var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var User = new mongoose.Schema({
    _id: {'type': String},
    username:String,
    password:String,
    name:String,
    DOB:String,
    height:Number,
    weight:Number,
    totalrat:Number,
    avgrat:Number,
    records: [{type: mongoose.Schema.Types.ObjectId,ref: "Record"}],
    reports: [{type: mongoose.Schema.Types.ObjectId,ref: "Report"}],
    prescriptions:[{type: mongoose.Schema.Types.ObjectId,ref: "Prescription"}]
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);                   



