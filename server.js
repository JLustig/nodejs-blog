/*******************************************************************************
MODULES
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

//static files to access styling etc
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

/*******************************************************************************
CONTROLLERS
*******************************************************************************/
require('./controllers/postcontroller.js')(app);
require('./controllers/usercontroller.js')(app);

/*******************************************************************************
LAUNCH
*******************************************************************************/
app.listen(port);
