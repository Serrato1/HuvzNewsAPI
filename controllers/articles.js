let knex = require('../db/knex');
let axios = require('axios');
let apiKey = '6ecec217c6e343bbbebe852777de904c' ;
let bases = ['everything?q=','top-headlines?country=us&']

function filterArticles(preferences , res , user_id){
    let liked = false;
    let disliked = false;
    if(preferences.indexOf(',') < 0){
        if(preferences === 'liked'){
            liked = true;
        }else if(preferences === 'disliked'){
            disliked = true;
        }
        preferences = [preferences];
    }else{
        preferences = preferences.split(',');
    }
    console.log("PREFERENCES " , preferences);
    knex("dislikes")
    .where({
        user_id 
    })
    .then((result)=>{
            let articleIdList = result.map((like,index)=>{
                return like.article_id
            });
            console.log(articleIdList);
            if(preferences[0] === 'trending'){
                axios('https://newsapi.org/v2/top-headlines?country=us&apiKey=6ecec217c6e343bbbebe852777de904c')
                .then((result)=>{
                    let articles = result.data.articles;
                    res.send(articles);
                })
            }else if(liked){
                knex("likes")
                .where({
                    user_id : user_id
                })
                .then((results)=>{
                    let likedId = result.map((likedPost,index)=>{
                        return likedPost.article_id
                    });
                    knex("articles")
                    .whereIn('id',likedId)
                    .then((result)=>{
                        console.log("articles", result.length);
                        let articles = result;
                        res.send(articles);
                    })
                })
            }else if(preferences.length === 1){
                console.log(preferences);
                axios('https://newsapi.org/v2/everything?q='+preferences[0]+'&apiKey=6ecec217c6e343bbbebe852777de904c')
                .then((result)=>{
                    console.log("blah")
                    let articles = result.data.articles;
                    articles = articles.map((article)=>{
                        article["sourceName"] = article.source.name ; 
                        return article;
                    })
                    res.send(articles);
                })
            }else{
                knex("articles")
                .whereNotIn('id',articleIdList)
                .then((articleResults)=>{
                    let articles = articleResults;
                    console.log(articles.length);
                        articles = articles.filter((article)=>{
                            // console.log('Article : ',article)
                            let title = article.title.toLowerCase();
                            for(i = 0 ; i <  preferences.length ; i++){
                                if(title.indexOf(preferences[i].toLowerCase()) >= 0 ){
                                    console.log("Found Article");
                                    return true;
                                }
                            }
                            return false;
                    })
                    res.send(articles);
                })
            }

    })
    .catch((err)=>{
        console.log("[ARTICLES]Filter Dislikes err : " , err);
    })
}

module.exports = {
    main : function(req,res){
        let userId = req.params.userid;
        let preferences = '';
        let apiCall = bases[0];
        userId = 56;
        console.log('[ARTICLES] userid : ', req.params.userid);
        knex("preferences")
        .where({
            user_id : userId
        })
        .then((result)=>{
            console.log('[ARTICLES] Preference Response : ' , result);
            if(result.length > 0 ){
                if(result[0].chosen_topic === 'feed'){
                    preferences = result[0].categories;
                    filterArticles(preferences,res,userId);
                }else if(result[0].chosen_topic === 'trending'){
                    preferences = "trending";
                    console.log("preference trending");
                    filterArticles(preferences,res,userId);
                }else if(result[0].chosen_topic === 'liked' || result[0].chosen_topic === 'disliked'){
                    preferences = result[0].chosen_topic ; 
                    console.log("preference like/dislike" , result[0].chosen_topic);
                    filterArticles(preferences, res, userId);
                }else{
                    preferences = result[0].chosen_topic;
                    filterArticles(preferences,res,userId);
                }
            }else{
                console.log("Preference Call Error", preferenceError);
                res.send(400);
            }
        })
        .catch((preferenceError)=>{
            console.log("Preference Call Error", preferenceError);
            res.sendStatus(400);
        })
    },
    trending : function(req,res){
        knex("liked")
        .then((rows)=>{
            let mostRecent = [];
            for(i = 0 ; i< 5; i++){
                console.log("");
                mostRecent.push(rows[i].article_id);
            }
            knex("articles")

            .whereIn('id',mostRecent)
            .then((articleRows)=>{
                let articles = articleRows.slice(3);
                console.log(articles);
                res.send(articles);
            })
        })

    },
    topic : function(req,res){
        let userId = req.params.userid;
        let preferences = '';
        console.log('[ARTICLES] userid : ', req.params.userid);
        userId = 56;
        let apiCall = bases[0];
        knex("preferences")
        .where({
            user_id : userId
        })
        .then((result)=>{
            console.log('[ARTICLES] Preference Response : ' , result);
            if(result.length > 0 ){
                preferences = result[0].categories;
                filterArticles(preferences,res,userId);
            }else{
                console.log("Preference Call Error", preferenceError);
                res.send(400);
            }
        })
        .catch((preferenceError)=>{
            console.log("Preference Call Error", preferenceError);
            res.sendStatus(400);
        })
    },


    like : function(req,res){
        let {userId , article_id} = req.body;
        knex("dislikes")
        .where({
            article_id : `${article_id}`
        }).del();
        knex("likes")
        .where({
            article_id
        })
        .then((rows)=>{
            if(rows.length > 0){
                res.sendStatus(400)
            }else{
                knex("likes")
                .insert({
                    article_id ,
                    user_id : userId
                })
                .then((result)=>{
                    console.log("Successfully Recorded Liked Article");
                    res.send("Successfully Recorded Liked Article");
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
        })
        .catch((error)=>{
            console.log(error);
            res.sendStatus(400);
        })
    },
    dislike : function(req,res){
        let {userId , article_id} = req.body;
        knex("dislikes")
        .where({
            article_id
        })
        .then((rows)=>{
            if(rows.length > 0){
                res.sendStatus(400)
            }else{
                knex("dislikes")
                .insert({
                    article_id ,
                    user_id : userId
                })
                .then((result)=>{
                    console.log("Successfully Recorded Disliked Article");
                    knex("likes")
                    .where({
                        article_id
                    }).del();
                    res.send("Successfully Recorded Disliked Article");
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
        })
        .catch((error)=>{
            console.log(error);
            res.sendStatus(400);
        })
    }

}




