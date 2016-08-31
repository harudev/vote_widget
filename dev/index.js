var express = require('express');
var mysql 	= require('mysql');
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
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.session());
	var router = express.Router();
	app.use('/api',router);

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
