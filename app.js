//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true});

const userSchema = new mongoose.Schema({ //schema
  email: String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']}); //always create befiore the mongoose model is created

const User = new mongoose.model("User",userSchema); //model name

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log("problem!!!");
      console.log(err);
    }
  })
});

app.post("/login",function(req,res){
  const userName = req.body.username;
  const passWord = req.body.password;

  User.findOne({email:userName},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === passWord){
          res.render("secrets");
        }
      }
    }
  })
});

app.listen(3000,function(){
  console.log("Server Started on port 3000");
});
