var mongoose = require("mongoose");
var shortid=require("shortid");
var passportLocalMongo=require("passport-local-mongoose");

var reportSchema = new mongoose.Schema({
    title: String,
    date: String,
    patid: String,
    docid: String,
    place: String,
    reportUrl:String,
    remarks:String
});

var presSchema = new mongoose.Schema({
  dateissued: String,
  validity: String,
  docid: String,
  patid: String,
  medicine:String
});

var patientSchema = new mongoose.Schema({
    _id: {
        'type': String,
        'default': shortid.generate
      },
    name: String,
    DOB: String,
    gender:String,
    bldgrp:String,
    height: Number,
    weight: Number,
    email: String,
    username:String,
    password:String,
    allergies:String,
    emergencontactname:String,
    emergencontactnum:String,
    profileimg:String,
    prescriptions: [presSchema],
    reports: [reportSchema]
});

patientSchema.plugin(passportLocalMongo);
module.exports = mongoose.model("Patient", patientSchema);


