var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
    isactive:Boolean,
    date: String,
    patid: String,
    docid: String
});

module.exports = mongoose.model("Session", sessionSchema);
