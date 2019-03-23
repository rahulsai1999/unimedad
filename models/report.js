var mongoose = require("mongoose");

var Report = new mongoose.Schema({
    title: String,
    date: String,
    patid: String,
    docid: String,
    place: String,
    reportUrl:String,
    remarks:String
});

module.exports = mongoose.model("Report", Report);