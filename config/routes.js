//Update the name of the controller below and rename the file.
let index = require("../controllers/index.js");
let login = require("../controllers/login.js");
let signup = require("../controllers/signup.js");
let articles = require("../controllers/articles.js");

module.exports = function(app){

  app.get('/', index.main);
  app.post('/login',login.login);

  app.post('/update/password',index.updatePassword);

  app.get('/articles/:userid',articles.main)
  app.get('/articles/trending',articles.trending)


  app.post('/signup',signup.signup);
  app.post('/signup/preference',signup.preferenceOption);

  app.post('/like',articles.like);
  app.post('/dislike',articles.dislike);

  app.post('/update/topic',index.preferenceSelection);




}


