//node packages 

const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const { urlencoded } = require("body-parser");
const upload = multer();

//set up express app

const app = express();
app.set("port", 10101);

//setiing up handlebars engine and json helper
app.engine("handlebars", exphbs({
    helpers: {
        json: function(context){
            return JSON.stringify(context);
        }
    }
}));
app.set("view engine", "handleBars");
app.use(urlencoded({extended: false}))

app.use(express.static("public"))

const info = {
    "title": "Doggy Data",
    "search":"Enter or select a dog breed",
}
app.get("/", function(req, res){
    var context = {}
    
})
app.use(function(req,res){
    res.status(404);
    res.render("404", context);
})
app.use(function(err,req,res, next){
    console.error(err.stack);
    res.status(500)
    var context = {}
    res.render("500", context)
})