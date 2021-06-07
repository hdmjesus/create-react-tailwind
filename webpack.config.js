/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
const path = require('path');
const webpack = require('webpack');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name][contenthash].js',
		assetModuleFilename: 'assets/images/[hash][ext][query]',
		chunkFilename: 'js/[id].[chunkhash].js',
		clean: true,
	},
	mode: 'production',
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@styles': path.resolve(__dirname, 'src/styles'),
			'@images': path.resolve(__dirname, 'src/assets/images'),
		},
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					'postcss-loader',
				],
			},
			{
				test: /\.(png|gif|jpg|svg|webp|pdf)$/,
				type: 'asset/resource',
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets/',
						},
					},
					// {
					// 	loader: 'url-loader',
					// 	options: {
					// 		mimetype: 'image/png',
					// 		limit: 1000,
					// 		name: '[contenthash].[ext]',
					// 		outputPath: 'assets',
					// 	},
					// },
				],
			},

			// {
			// 	test: /\.(woff|woff2)$/,
			// 	use: {
			// 		loader: 'url-loader',
			// 		options: {
			// 			limit: 10000,
			// 			MimeType: 'aplication/font-woff',
			// 			name: '[name].[contenthash].[ext]',
			// 			outputPath: './assets/font',
			// 			publicPath: '../assets/font',
			// 			esModule: false,
			// 		},
			// 	},
			// },
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, './public/index.html'),
			filename: './index.html',
			//Asi agregamos el favicon
			// favicon: path.resolve(__dirname, 'src/statics/favicon.png'),
		}),
		new ScriptExtHtmlWebpackPlugin({
			async: ['app'],
		}),
		new AddAssetHtmlPlugin({
			filepath: path.resolve(__dirname, 'dist/js/*.dll.js'),
			outputPath: 'js',
			publicPath: 'js/',
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
			chunkFilename: 'css/[id].[chunkhash].css',
		}),
		// new CopyWebpackPlugin({
		// 	patterns: [
		// 		{
		// 			from: path.resolve(__dirname, 'src', 'assets/images'),
		// 			to: 'assets/images',
		// 		},
		// 	],
		// }),
		new webpack.DllReferencePlugin({
			manifest: require('./modules-manifest.json'),
			// context: path.resolve(__dirname, '.src/'),
		}),
	],
	optimization: {
		minimizer: true,
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	},
};
