require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const SHA256 = require("crypto-js/sha256");


mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true, 
useUnifiedTopology: true })
.then(() => {
    console.log("Connected to Mongo");
})
.catch((err) => {
    console.log("Mongo Connection Error");
    console.log(err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = mongoose.model("User", userSchema);


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.render("home", {})
});

app.get("/login", (req, res) => {
    res.render("login", {})
});

app.get("/register", (req, res) => {
    res.render("register", {})
});


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: SHA256(req.body.password).toString()
    });

    newUser.save((err) => {
        if(!err){
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = SHA256(req.body.password).toString();

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});










app.listen(process.env.PORT || 3000, () => {
    console.log("The server started on port 3000");
});