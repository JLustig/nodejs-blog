var crypto = require('crypto');

function hash(text) {
  return crypto.createHash('sha1')
  .update(text).digest('base64')
};

function getlogin (req, res) {
	console.log("requesting login form...");
	res.render('login.jade'); 
}

//nu skapas en session även om man inte blir godkänd, åtgärda
function submitlogin (req, res) {
	req.user=req.body;
	console.log("requser", req.user);
	req.session.user = {name:req.body.name,password:hash(req.body.password)};
	res.redirect('/createpost');
}

/*******************************************************************************
ROUTES
*******************************************************************************/
module.exports = function(app, auth) {
	app.get('/login', getlogin);
	app.post('/login', submitlogin);
}