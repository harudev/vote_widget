function db_settings()
{
	// Change parameters to connect MySQL server
	return {
		connectionLimit:100,
		host:'localhost',
		user:'root',
		password:'makenaituyosa5*',
		database:'vote_widget',
		debug:false};
}

module.exports = db_settings;