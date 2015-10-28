/*******************************************************************************
SET UP - ALL THE TOOLS WE NEED
*******************************************************************************/
var express  = require('express');
var app      = module.exports = express();
var port     = process.env.PORT || 1337;
var morgan   = require('morgan');
var bodyParser   = require('body-parser');
var mongoose = require('mongoose');
var basicAuth = require('basic-auth');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
/*******************************************************************************
CONFIGURATION
*******************************************************************************/

//static files to get styling etc
app.use("/client", express.static(__dirname + '/client'));

// log every request to the console
app.use(morgan('dev'));
// get information from html forms 					
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up jade for templating
app.set('view engine', 'jade');

//connect to db
mongoose.connect('mongodb://localhost/blogdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connected to db...');
});

/*******************************************************************************
AUTHENTICATION
*******************************************************************************/
var User = require('./models/usermodel.js');

//store sessions in mongo
app.use(session({
	secret: "iojsfijoisdjfojs",
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({
        db: "blogdb",
        host: "localhost",
        clear_interval: 60*60  // hour
    })
}));
app.use(cookieParser());

var auth = function(req, res, next) {
	console.log("session info",req.session);
	console.log("cookie info",req.cookies);
	console.log("authenticating");
	console.log("session user",req.session.user);
	var requser = req.session.user;

	if (!requser || !requser.name || !requser.password){
			console.log("access denied: user not set correctly");
	}
	User.findOne({name:requser.name}, function(err, userdb) {
		console.log("searching for user");
		console.log("userdb",userdb);
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

function addadmin (req,res) {
	console.log("adding admin...");
	User.findOne({name:"admin"}, function(err, user) {
		if(err || !user ){
			User.create({name:"admin",password:hash("test")}, function (err){
				if (err) return console.log(err);
			})
		}else{
			return console.log("user already exists");
		}
	})
}

/*******************************************************************************
CONTROLLERS
*******************************************************************************/
require('./controllers/postcontroller.js')(app, auth);
require('./controllers/usercontroller.js')(app, auth);

/*******************************************************************************
LAUNCH
*******************************************************************************/
app.listen(port);
