var mongoose = require("mongoose");

var Prescription = new mongoose.Schema({
   dateissued: String,
   validity: String,
   docid: String,
   patid: String,
   medicine:String
});

module.exports = mongoose.model("Prescription", Prescription);