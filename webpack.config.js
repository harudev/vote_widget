const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = [{
	name:'browser',
	devtool:'eval-source-map',
	entry:__dirname + "/server/browser.js",
	// entry:__dirname+"/reactapps/app.js",
	output: {
		path: __dirname + "/public",
		filename: "bundle.js"
	},
	module:{
		loaders: [
			{
				test:/\.jsx$/,
				loaders:'babel',
			},
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:'babel'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css')
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
			}
		]
	},
	plugins: [new ExtractTextPlugin('styles.css')],
	devServer:{
		contentBase:"./templates",
		colors:true,
		historyApiFailback:true,
		inline:true,
		port:4000
	},
	resolve : {
		root:__dirname
	}
},
{
	name:'server',
	entry: {
		app:['./server/index.js'],
	},
	target:'node',
	externals: [nodeExternals()],
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
				loader:'null'
			},
			{
				test: /\.scss$/,
				loader: 'css-loader/locals?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			}
		]
	},
	moduleDirectories:['node_modules'],
	output: {
		path:'./public',
		filename:'server.js',
		libraryTarget:'commonjs2'
	},
	resolve : {
		root:__dirname
	}
}];