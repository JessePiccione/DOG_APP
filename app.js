
//node packages 
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const  axios = require('axios');
const cheerio = require('cheerio');
const { html } = require("cheerio/lib/static");
let { data } = require("cheerio/lib/api/attributes");
const url = "https://en.wikipedia.org/wiki/"

//helper functions 
function print(str){
    console.log(str)
}

async function scrape (subpage, key) {
    subpage = subpage.trim()
    var page = url + encodeURIComponent(subpage);
    let payload = ''
    if (key ==  1){
        let promise = axios.post(page)
            .then(res =>{
                let table = html => {
                    data = {}
                    const $ = cheerio.load(html);
                    $('table.infobox td.infobox-image').each((i,elem) =>{
                        item = $(elem).find('img').attr('src')
                        data.image_link = item
                    });
                }
                table(res.data);
                payload = JSON.parse(JSON.stringify(data));
                return payload;
            })
            .catch(error => {
                console.log(error);
            });
        let result = await promise
        return payload  
    }

    else{
        let promise = axios.post(page)
            .then(res =>{
                let table = html => {
                    data = {dbreed:"unavailible",
                            dheight:"unavailible",
                            dweight:"unavailible",
                            dcoat:"unavailible",
                            dcolor:"unavailible",
                            dlitter:"unavailible",
                            dlife:"unavailible"
                        }
                    const $ = cheerio.load(html);
                    let bools  = {
                        dogs: false,
                        coat: false,
                        litter: false,
                        color: false,
                        life: false
                    }
                    $('table.infobox td,th').each((i,elem) =>{
                        item = $(elem).text().trim()
                        //breed name is always at index 0
                        if(i == 0){
                            data.dbreed = item
                        }
                        //want just stats about the male dogs
                        //most are in close range to female
                        if(item == 'Dogs'){ 
                            bools.dogs = true
                        }
                        else if (bools.dogs) {
                            
                            bools.dogs = false
                            if(item.indexOf('cm') != -1) {
                                data.dheight = item
                            }
                            else {
                                data.dweight = item
                            }
                        }
                        else if(item == "Coat"){
                            bools.coat = true
                        }
                        else if (bools.coat){
                            bools.coat = false
                            data.dcoat = item
                        }
                        else if(item == "Litter size"){
                            bools.litter = true
                        }
                        else if(bools.litter){
                            bools.litter = false
                            data.dlitter = item
                        }
                        else if(item == "Color"){
                            bools.color = true
                        }
                        else if (bools.color){
                            bools.color = false
                            data.dcolor = item
                        }
                        else if( item == "Life span") {
                            bools.life = true
                        }
                        else if (bools.life){
                            bools.life = false
                            data.dlife = item
                        }
                       
                        
                    });
                }
                table(res.data);
                payload = JSON.parse(JSON.stringify(data));
                
                return payload;
            })
            .catch(error => {
                console.log(error);
            });
        let result = await promise
        return payload
    }
    
}
scrape("Gyūdon",1)
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
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static("public"))


app.get("/", function(req, res){
    context = {}
    res.render('app_home',context)
    
})
app.post("/", async function(req, res){
    context = await scrape(req.body.search)
    context.image_link = (await scrape(req.body.search,1)).image_link
    
    res.render('dogdisplay', context);
});
app.get("/compare", function(req, res){
    context = {dbreed:"German Shepherd",dheight:"60-65 cm (24-26 in)",dweight:"30-40 kg (66-88 lb)",dcolor:"Tan with black saddle, sable, solid black or bi-color",dcoat:"Double coat",dlitter: "4-9", dlife:"9-13"};
    res.render('compare', context)
});
app.post("/scrape", async function(req,res){
    string = req.body.subpage
    console.log(req.body)
    context = await scrape(string,1)
    //console.log(context)
    
    res.send(context); 
    console.log('done')
})
app.use(function(req,res){
    res.status(404);
    var context = {"error":"404 not found error - Errrrrrrr Frustrating isn't it!!"}
    res.render("error", context);
})
app.use(function(err,req,res, next){
    console.error(err.stack);
    res.status(500)
    var context = {"error": "500 error - server error - Sorry :)"}
    res.render("error", context)
})
app.listen(app.get("port"), () => {
    console.log("Running Express at http://localhost:" + app.get("port") + "\nPress Ctrl-C to terminate...");
});