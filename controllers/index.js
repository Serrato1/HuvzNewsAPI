var knex = require('../db/knex');

module.exports = {
  main: function(req, res, next) {
    console.log("recieved request"); 
    res.sendStatus(200);     
  },
  login : function(req,res,next){
    let {username, password} = req.body ;
    username = username.toLowerCase();
    password = password.toLowerCase();
    knex("users")
    .where({
      username,
      password
    })
    .then((result)=>{
      if(result.length > 0 ){
      console.log("Successful Login")
      console.log(result);
      res.send(true);     
      }else{
        console.log("Incorrect Login");
        res.send(false);
      }                                        
    })
  },
  preferenceSelection : function(req,res){
    console.log("[TOPIC UPDATE] Update Object",req.body)
    let userId = 56;
    knex("preferences")
    .where({
      user_id : userId
    })
    .update({
      chosen_topic : req.body.topic
    })
    .then((result)=>{
      console.log("Chose Topic :  ", req.body.topic);
    })
  },
  updatePassword : function(req,res){

    knex("users")
    .where({
      id  :                             req.body.user_id
    })
    .update({
      password :req.body.password                    
    })
    .then((result)=>{
      console.log("updated success");
    })
    .catch((err)=>{
      console.log("error" ,  err);
    })
  }
};







