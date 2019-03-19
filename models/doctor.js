var mongoose = require("mongoose");

var passportLocalMongo=require("passport-local-mongoose");

var docSchema = new mongoose.Schema({
    name: String,
    DOB: String,
    gender:String,
    yrsexp:String,
    email: String,
    username: String,
    password:String,
    profileimg:String
});

docSchema.plugin(passportLocalMongo);
module.exports = mongoose.model("Doctor", docSchema);