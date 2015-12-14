var controllers = require('./controllers');
var mid = require('./middleware');

var router = function(app) {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  
  app.get('/play', mid.requiresLogin, controllers.Char.makerPage);
  
  app.post('/makechar', mid.requiresLogin, controllers.Char.make);
  app.post('/deletechar', mid.requiresLogin, controllers.Char.delete);
  app.post('/selectchar', mid.requiresLogin, controllers.Char.select);
  app.post('/editchar', mid.requiresLogin, controllers.Char.edit);
  
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;