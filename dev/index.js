var express	= require('express');
var mysql 	= require('mysql');
var bodyParser 	= require('body-parser');
var dbinfo 	= require('./database-settings.js');
var rest 	= require('./REST.js');
var app 	= express();

function REST() {
	var self = this;
	self.connectMysql();
}

REST.prototype.connectMysql = function () {
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

REST.prototype.configureExpress = function(conn) {
	var self = this;
	app.set('port',process.env.PORT || 3000);
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	var router = express.Router();
	// app.use('/',);  템플릿용 라우팅 필요
	app.use(router);
	var rest_router = new rest(router,conn);
	self.startServer();
}

REST.prototype.startServer = function() {
		app.listen(3000,function(){
		console.log("All right ! I am alive at Port 3000.");
	});
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();