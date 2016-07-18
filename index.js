var path          = require('path'),
		fs				    = require('fs'),
    express       = require('express'),
    cookieParser 	= require('cookie-parser'),
    bodyParser    = require('body-parser'),
    http 			    = require('http'),
    https 	 	    = require('https'),
    config        = require('./config');

var publicfolder = path.join(__dirname, 'public');
var libraryfolder = path.join(__dirname, 'bower_components');

// ====  initialize app ====
var app = express();

// ====  initialize server ====
var server_options = {};
var server = null;
if(!config.server.secure){
	server_options.port = config.server.port;
	server = http.createServer(app);
}else{
	server_options.port = config.server.port;
	server_options.key = fs.readFileSync(path.join(process.env.HOME, config.server.key), 'utf8');
	server_options.cert = fs.readFileSync(path.join(process.env.HOME, config.server.pem), 'utf8');
	server = https.createServer(server_options, app);
}

// ==== start server ====
server.listen(server_options.port, function(){
	console.log('listening on *:' + server.address().port);
})

// ==== initialize Web Socket ====
var websocket = require('./api/websocket/')(server);

// ==== initialize middleware ====
app.use(cookieParser(config.server.cookiekey));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Make websocket (io) accessible to express requests
app.use(function(req,res,next){
    req.io = websocket.io;
    next();
});

// ==== API ====
app.use('/api',  require('./api/'));

// ==== Web App ====
app.get('/', function(req, res){
	res.sendFile(publicfolder + '/html/index.html');
});

app.use('/', express.static(publicfolder));
app.use('/lib', express.static(libraryfolder));

module.exports = app;
