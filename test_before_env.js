// this file is created before the creation of .env files or before the creation of environment variables.
// so this file will be used as a reference to see how we use "secret" to encrypt passwords
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";
//mongoose encrypt works in such a way that when we call save it encrypts and when we call find it decrypts. 
userSchema.plugin(encrypt,{secret : secret , encryptedFields:["password"]});//Here in this line we are adding the
//mongooose encrypt as a plug in to our userschema and then we are gonna pass over our secret as javascript object.


//this👆 plugin line should be written before declaration and here we have also encrypted only one field i.e password
//of mongoose.model below👇

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res) {
    res.render("login");
});

app.get("/register",function(req,res) {
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password 
    }); 

    newUser.save(function(err) {
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},function(err,foundUser) {
        if(err){
            console.log(err);
        }else{
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
