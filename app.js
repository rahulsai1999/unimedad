//libraries
var express=require("express");
var http=require("http");
var mongoose = require("mongoose");
var request=require("request");
var bodyParser=require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var shortid=require('shortid');
var multer=require('multer')
var upload = multer({ dest: 'uploads/' })
var fs=require("fs-extra");
var cloudinary= require("cloudinary");
var app=express();

//models
var Presc = require("./models/presc");
var Doctor = require("./models/doctor");
var Record = require("./models/record");
var Report = require("./models/report");
var User = require("./models/user");
var Session = require("./models/session");

//utilities
//mongoose.connect("mongodb://localhost:27017/unimed",{ useNewUrlParser: true });
mongoose.connect("mongodb://user23:user23@ds155164.mlab.com:55164/unimed",{ useNewUrlParser: true });
//app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
cloudinary.config({ 
    cloud_name: 'doweee6jj', 
    api_key: '124511839359123', 
    api_secret: 'kagBDiVjxDe4_6SUJgtDKKpbNuE' 
  });  
curu={};
//auth requirements
app.use(require("express-session")({
    secret:"bookrev",
    resave:false,
    saveUninitialized:false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 
 app.use(function(req,res,next){
    curu=req.user;
    res.locals.currentUser = req.user;
    next();
  })

//initialroutes
app.get("/",function(req,res){
    res.render("index");
});

app.get("/loginselect",function(req,res){
    res.render("loginselect");
});

app.get("/pathome",isLoggedIn,function(req,res){
    User.findById(req.user.id).populate("records reports prescriptions").exec(function(err,foundb){
        res.render("pathome",{curuser:foundb});
    });
});
app.get("/dochome",function(req,res){
    Session.find({docid:'5c6a84f73327b20004bce6c8'},function(err,found){
        res.render("dochome",{data:found});
    });
});

app.get("/session/:id",function(req,res){
    var userid=req.params.id;
    Session.findById(userid,function(err,found){
        if(err)
        console.log(err);
        else{
        if(found.isactive){
            User.findById(found.patid).populate("records reports prescriptions").exec(function(err,foundb){
                res.render("session",{currentUser:foundb});
            });
            }
        else
        res.redirect("/");    
        }
    });
});

//report routes
app.get("/reportup",function(req,res){
    res.render("reportup");
});

app.post('/reportup', upload.single('avatar'), function (req, res) {
    
    var file=req.file;
    console.log(file.path);
    var title=req.body.title;
    var patid=req.body.patid;
    var docid=req.body.docid;
    var place=req.body.place;
    var remarks=req.body.remarks;
    var datetime = new Date();
    var dte=datetime.toISOString().slice(0,10);

    cloudinary.v2.uploader.upload(file.path,function(error, result) 
    {
      if(!error)
      {
          console.log(result);
          var report=new Report({
              title:title,
              date:dte,
              patid:patid,
              docid:docid,
              place:place,
              remarks:remarks,
              reportUrl:result.secure_url
          });
          fs.remove(file.path);
          Report.create(report,function(err,newrep){
              if(err){
                  res.redirect("/reportup")
              }
              else
              {
                  User.findById(patid,function(err,found){
                      if(err)
                      console.log(err);
                      else
                      {
                          found.reports.push(newrep);
                          User.findByIdAndUpdate(patid,found,function(err,fin){
                              if(err)
                              console.log(err);
                              else
                              console.log(fin);
                          });
                      }
                  });
              }
          });
      }
      else
      {
        console.log(error);
        res.redirect("/reportup");
      }
    });
    res.redirect("/dochome");
  });

//prescription routes
app.get("/prescup",function(req,res){
    res.render("prescup");
});

app.post("/prescup",function(req,res){

    var medicine=req.body.medicine;
    var patid=req.body.patid;
    var docid=req.body.docid;
    var validity=req.body.valdyt;
    var dte=new Date().toLocaleDateString();
    
    var presc=new Presc({
        dateissued:dte,
        validity:validity,
        patid:patid,
        docid:docid,
        medicine:medicine
    });
    
    Presc.create(presc,function(err,newpresc){
        if(err){
            res.redirect("/reportup")
        }
        else
        {
            User.findById(patid,function(err,found){
                if(err)
                console.log(err);
                else
                {
                    found.prescriptions.push(newpresc);
                    User.findByIdAndUpdate(patid,found,function(err,fin){
                        if(err)
                        console.log(err);
                        else
                        console.log(fin);
                    });
                }
            });
        }
    });

    res.redirect("/dochome");
});

//auth
app.get("/patlogin",function(req,res){
    res.render("patlogin");
});

app.get("/patreg",function(req,res){
    res.render("patreg")
});

app.post("/register",function(req,res){
    User.register(new User(
    {   _id:shortid.generate().slice(0,7),
        name:req.body.name,
        DOB:req.body.dob,
        username:req.body.username,
        email:req.body.email,
        height:req.body.height,
        weight:req.body.weight
    }),
    req.body.password,
        function(err,user){
            if(err)
            {
                console.log(err);
                alert("Username already taken or Password not valid")
                res.render("patreg");
            }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/patlogin");
        });
    });
});

app.post("/login",passport.authenticate("local",{
    failureRedirect:"/patlogin"}),
    function(req,res){
        res.redirect("/pathome");
    });

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/patlogin");
});  

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/patlogin");
}

//server 
var server = http.createServer(app);
var port = process.env.PORT||3000;
app.set('port', port);
server.listen(port);
    