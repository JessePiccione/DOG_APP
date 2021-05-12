const puppeteer = require('puppeteer');
//node packages 
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const { urlencoded } = require("body-parser");
const upload = multer();
const fetch = require("isomorphic-fetch")

//set up express app

const app = express();
app.set("port", 10101);

//setiing up handlebars engine and json helper
app.engine("handlebars", exphbs({
    helpers: {
        json: function(context){
            return JSON.stringify(context);
        }
    },
    defaultLayout:"main"
}));
app.set("view engine", "handlebars");
app.use(urlencoded({extended: false}))

app.use(express.static("public"))


app.get("/", function(req, res){
    context = {}
    res.render('app_home',context)
    
})
app.post("/", function(req, res){
    context = {dbreed:"GSD",dheight:"3 ft",dweight:"88 lbs",dcolor:"red,gray,white,black,brown",dcoat:"double coat",dlitter: "4-9 pups", dlife:"10-13 years"};
    res.render('dogdisplay', context);
});
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
app.listen(app.get("port"), () => {
    console.log("Running Express at http://localhost:" + app.get("port") + "\nPress Ctrl-C to terminate...");
});