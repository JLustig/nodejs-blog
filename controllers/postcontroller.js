var Post = require('../models/postmodel.js');

function getposts (req, res) {
	console.log("getting posts...");
	Post.find({},null,{sort:{_id:-1}, skip:0, limit:20},function (err, posts) {
  		if (err) return console.error(err);
  		console.log(posts);
  		res.render('all_view.jade', {posts:posts}); 
	})
}

function getsinglepost (req, res) {
	console.log("getting post...");
	console.log(req.query);
	Post.find(req.query,function (err, posts) {
  		if (err) return console.error(err);
  		console.log(posts);
  		res.render('single_view.jade', {posts:posts}); 
	})
}

function getcreatepost (req, res) {
	console.log("creating post...");
	res.render('createpost.jade');
}

function createpost (req,res) {
	console.log("adding post...");
	console.log(req.body);
	Post.create(req.body, function (err) {
  		if (err) return console.error(err);
  		res.render('createpost.jade');
	});
}

function geteditpost (req,res) {
	//get query
	//get post with id
}

function editpost (req,res) {
	
}

/*******************************************************************************
ROUTES
*******************************************************************************/
module.exports = function(app, auth) {
	console.log(auth);
	app.get('/', getposts);
	app.get('/singlepost', getsinglepost);
	app.get('/createpost', auth, getcreatepost);
	app.post('/createpost', auth, createpost);
	app.get('/editpost', auth, geteditpost);
	app.post('editpost', auth, editpost);
}