require('babel-core/register')({
        "presets": ["es2015", "react"]
});

var express	= require('express');
var mysql 	= require('mysql');
var bodyParser 	= require('body-parser');
var dbinfo 	= require('./database-settings.js');
var app 	= express();
var path = require('path');

function server() {
	var self = this;
	self.connectMysql();
}

server.prototype.connectMysql = function () {
	var self = this;
	var pool = mysql.createPool(new dbinfo());

	pool.getConnection(function (err, conn) {
		if(err) {
			self.stop(err);
		}
		else {
			self.configureExpress(conn);
		}
	})
}

server.prototype.configureExpress = function(conn) {
	var self = this;
	app.set('port',process.env.PORT || 3000);
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Content-Type");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	});
	app.set('views','./public');
	app.set('view engine','ejs');

	// css 처리를 위한 디렉토리 설정
	app.use('/public', express.static(path.join(__dirname,'..','/public')));
	console.log(__dirname);
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());

	// REST API를 위한 라우터 설정
	var restRouter = require('./REST.js')(conn);
	app.use('/api',restRouter);


	// react app 렌더링을 위한 라우터 설정
	var reactRouter = require('./react.js')();
	app.get('*',reactRouter);


	self.startServer();
}

server.prototype.startServer = function() {
		app.listen(3000,function(){
		console.log("All right ! I am alive at Port 3000.");
	});
}

server.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new server();
