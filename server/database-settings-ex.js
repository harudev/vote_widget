function db_settings()
{
	// Change parameters to connect MySQL server
	return {
		connectionLimit:100,
		host:'hostname',
		user:'username',
		password:'password',
		database:'dbname',
		debug:false};
}

module.exports = db_settings;