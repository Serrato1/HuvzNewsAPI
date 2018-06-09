var knex = require('../db/knex');

module.exports = {
  signup : function(req,res,next){
    let {username, password} = req.body ;
    username = username.toLowerCase();
    password = password.toLowerCase();
    knex('users')
    .where({
      username : `${username}`
    })
    .then((response)=>{
      console.log("Response Length : ",response.length)
      if(response.length === 0){
        knex("users")
        .insert({
          username,
          password
        })
        .then((result)=>{
          console.log(result);
          res.send(true);
        })
      }else{
        console.log("user",username , "already exists");
        res.send("User Already Exists");
      }
    })
    .catch((signupError)=>{
      console.log(signupError);
      res.send(false);
    })

  },
  preferenceOption : function(req,res){
    let {username} = req.body ;
    username = username.toLowerCase();
    knex("users")
    .where({
      username : `${username}`
    })
    .then((result)=>{
      if(result.length !== 0 ){
        console.log(result[0]);
        let userId = result[0].id;
        console.log("found user in database", username , ' ID : ', userId);
        knex("preferences")
        .where({
          user_id : userId
        })
        .then((rows)=>{
          if(rows.length != 0){
            knex("preferences").where({ user_id : userId}).update({categories : `${req.body.options}`})
            .then((output)=>{
              console.log("Successfully Updated Preferences");
              res.send(`${userId}`);
            })
            .catch((err)=>{
              console.log("Error Updating Preference :",  err)
            })
          }else{
            knex("preferences")
            .insert({
              user_id : `${userId}`,
              categories : `${req.body.options}`,
              chosen_topic : 'none'
            })
            .then((output)=>{
              console.log("output");
              res.send(`${userId}`);
            })
            .catch((err)=>{
              console.log("Error Inserting in Preference :",  err)
            })
          }
        })
        .catch((err)=>{
          console.log("Error Inserting in Preference :",  err)
        })
      }else{
        console.log("error , user not found");
        res.sendStatus(400);
      }
    })
    .catch((err)=>{
        console.log("Error" , err)
        res.sendStatus(400);
    })
  }
};







