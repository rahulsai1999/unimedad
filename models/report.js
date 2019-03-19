var mongoose = require("mongoose");

var reportSchema = new mongoose.Schema({
    title: String,
    date: String,
    patid: String,
    docid: String,
    place: String,
    reportUrl:String,
    remarks:String
});

module.exports = mongoose.model("Report", reportSchema);