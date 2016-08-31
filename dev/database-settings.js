function db_settings()
{
	return {
		connectionLimit:100,
		host:'hostname',
		user:'username',
		password:'password',
		database:'dbname',
		debug:false};
}

module.exports = db_settings;