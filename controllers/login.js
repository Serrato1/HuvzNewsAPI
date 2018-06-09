var knex = require('../db/knex');

module.exports = {
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
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result[0]));
      }else{
        console.log("Incorrect Login");
        res.send(false);
      }                                        
    })
  }
};







