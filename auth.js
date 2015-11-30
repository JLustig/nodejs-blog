/*******************************************************************************
AUTHENTICATION
*******************************************************************************/
var User = require('./models/usermodel.js');

var auth = function(req, res, next) {
	/*console.log("session info",req.session);
	console.log("cookie info",req.cookies);
	console.log("authenticating");
	console.log("session user",req.session.user);*/
	var requser = req.session.user;

	if (!requser || !requser.name || !requser.password){
			console.log("access denied: user not set correctly");
	}
	User.findOne({name:requser.name}, function(err, userdb) {
		console.log("searching for user");
		if (err || !userdb){
			console.log("access denied: no such user in db");
			return res.sendStatus(401);
		}
		if (userdb.password === requser.password) {
			console.log("access granted");
			next();
		}else {
			console.log("passwords not matching");
			return res.sendStatus(401);
		}
	})
};

module.exports=auth;