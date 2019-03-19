var mongoose = require("mongoose");

// POST - title, content
var presSchema = new mongoose.Schema({
   dateissued: String,
   validity: String,
   docid: String,
   docname:String,
   patid: String,
   medicine:String
});

module.exports = mongoose.model("Prescr", presSchema);