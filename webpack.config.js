module.exports = {
	devtool:'eval-source-map',
	entry:__dirname + "/reactapps/app.js",
	output: {
		path: __dirname + "/dist",
		filename: "bundle.js"
	},
	module:{
		loaders: [
			{
				test:/\.jsx$/,
				loaders:'babel'
			},
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:'babel'
			},
			{
				test:/\.css$/,
				loader:'style!css?modules'
			}
		]
	},
	devServer:{
		contentBase:"./templates",
		colors:true,
		historyApiFailback:true,
		inline:true,
		port:4000
	}
}