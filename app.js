require('dotenv').config();
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

/*const secret = "Thisisourlittlesecret."; Here we have commented this line that means we wont be using this line of code in our actual code becoz this can be stolen
to use it to decrypt so we are gonna be using ".env" or environment variables which will keep our "secret" a secret and 
we are gonna require or process it from there(.env files)*/

// so to require API_KEY from .env we are gonna write 'process.env.API_KEY' therefore👇
console.log(process.env.API_KEY);


//mongoose encrypt works in such a way that when we call save it encrypts and when we call find it decrypts. 
userSchema.plugin(encrypt,{secret : process.env.SECRET , encryptedFields:["password"]});//Here in this line we are adding the
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
