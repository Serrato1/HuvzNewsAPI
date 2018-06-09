let express = require('express');
let app = express();
let axios = require('axios');
const port = process.env.PORT || 5000;

const env = 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

var routes_setter = require('./config/routes.js');
routes_setter(app);

app.listen(port,()=>{
    console.log("Listening on Port : ", port ) ; 
})

setInterval(function(){
    let apiKey = '6ecec217c6e343bbbebe852777de904c' ;
    let bases = ['everything?q=','top-headlines?country=us&']
    let query = ['tech','sports','trump','mac','apple','bitcoin','videogame','north%20korea'].join(',').replace(/,/g , " OR ");
    let uri = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
    axios(uri)
    .then((result)=>{
        let articles = result.data.articles.map((article,id)=>{
            return article;
        })
        articles.map((article,index)=>{
            let {url , title,author,description,urlToImage,publishedAt , source } = article ; 
            let sourceName = source.name;
            knex("articles")
            .where({
                url : article.url
            })
            .then((articleRows)=>{
                if(articleRows.length === 0){
                    console.log("[ARTICLES] Inserting New Article :", url);
                    knex("articles")
                    .insert({
                        url,
                        title,
                        author,
                        description,
                        urlToImage,
                        publishedAt,
                        sourceName
                    })
                    .then((insertResult)=>{
                        console.log("[ARTICLES] Insertion Message : Successfully Added Article");
                    })
                }else{
                    console.log("[ARTICLES] Insertion Message : Article Already Exists");
                }
            })
        })
    })
    let uriNew = `https://newsapi.org/v2/${bases[1]}apiKey=${apiKey}`;
    axios(uriNew)
    .then((result)=>{
        let articles = result.data.articles.map((article,id)=>{
            return article;
        })
        articles.map((article,index)=>{
            let {url , title,author,description,urlToImage,publishedAt , source } = article ; 
            let sourceName = source.name;
            knex("articles")
            .where({
                url : article.url
            })
            .then((articleRows)=>{
                if(articleRows.length === 0){
                    console.log("[ARTICLES] Inserting New Article :", url);
                    knex("articles")
                    .insert({
                        url,
                        title,
                        author,
                        description,
                        urlToImage,
                        publishedAt,
                        sourceName
                    })
                    .then((insertResult)=>{
                        console.log("[ARTICLES] Insertion Message : Successfully Added Article");
                    })
                }else{
                    console.log("[ARTICLES] Insertion Message : Article Already Exists");
                }
            })
        })
    })
  
}, 60000);