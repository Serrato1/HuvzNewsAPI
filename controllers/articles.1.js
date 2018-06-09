let knex = require('../db/knex');
let axios = require('axios');
let apiKey = '6ecec217c6e343bbbebe852777de904c' ;
let bases = ['everything?q=','top-headlines?country=us&']

function insertArticles(articles , res){
    console.log("[ARTICLES] Inserting Articles : ",articles);
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
    res.send(articles)
}
module.exports = {
    main : function(req,res){
        let userId = req.params.userid;
        console.log('[ARTICLES] userid : ', req.params.userid);
        let apiCall = bases[0];
        knex("preferences")
        .where({
            user_id : userId
        })
        .then((result)=>{
            console.log('[ARTICLES] Preference Response : ' , result);
            if(result.length > 0 ){
                let query = `(${result[0].categories.replace(/,/g , " OR ")})` ;
                apiCall = bases[0] + query ; 
            }else{
                apiCall = bases[0];
            }
            console.log('[ARTICLES] ApiCall : ', apiCall);
            axios("https://newsapi.org/v2/"+ apiCall +"&apiKey="+apiKey)
            .then((result)=>{
              let articles = result.data.articles.map((article,id)=>{
                return article;
              })
              insertArticles(articles , res);
            })
        })
        .catch((preferenceError)=>{
            console.log("Preference Call Error", preferenceError);
            res.sendStatus(400);
        })
    },
}