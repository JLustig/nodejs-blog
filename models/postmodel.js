var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	title: String,
	text: String,
	author: String,
	created_at    : { type: Date, required: true, default: Date.now }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;