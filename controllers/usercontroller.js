var User = require('../models/usermodel.js');
var crypto = require('crypto');
var auth = require('../auth.js');
var validator = require('validator');

//b-crypt precomputation, sha-2 par tusen varv
function hash(text) {
  return crypto.createHash('sha1')
  .update(text).digest('base64')
};

function getlogin (req, res) {
	res.render('login.jade'); 
};

//create session for the user
function submitlogin (req, res) {
	req.session.user = {name:validator.escape(req.body.name),password:hash(req.body.password)};
	res.redirect('/createpost');
};

//REMOVE IN PRODUCTION
function addusers (req,res) {
	User.findOne({name:"admin"}, function(err, user) {
		if(!user){
			User.create({name:"admin",password:hash("test")}, function (err){
				if (err) return console.log(err);
			})
		}
	}),
	User.findOne({name:"guest"}, function(err, user) {
		if(!user){
			User.create({name:"guest",password:hash("test")}, function (err){
				if (err) return console.log(err);
			})
		}
	})
};
addusers();

/*******************************************************************************
ROUTES
*******************************************************************************/
module.exports = function(app) {
	app.get('/login', getlogin);
	app.post('/login', submitlogin);
}