var Post = require('../models/postmodel.js');
var auth = require('../auth.js');

function getposts (req, res) {
	Post.find({},null,{sort:{_id:-1}, skip:0, limit:20},function (err, posts) {
  		if (err) return console.error(err);
  		res.render('all_view.jade', {posts:posts}); 
	})
}

function getsinglepost (req, res) {
	Post.find(req.query,function (err, posts) {
  		if (err) return console.error(err);
  		res.render('single_view.jade', {posts:posts}); 
	})
}

function getcreatepost (req, res) {
	res.render('createpost.jade');
}

function createpost (req,res) {
	console.log(req.body);
	post=req.body;
	post["author"]=req.session.user.name;
	Post.create(post, function (err) {
  		if (err) return console.error(err);
  		res.render('createpost.jade');
	});
}

/*******************************************************************************
ROUTES
*******************************************************************************/
module.exports = function(app) {
	app.get('/', getposts);
	app.get('/singlepost', getsinglepost);
	app.get('/createpost', auth, getcreatepost);
	app.post('/createpost', auth, createpost);
}