module.exports = {
	source: __dirname + '/source',
	output: __dirname + '/target',
	webroot: __dirname + '/target',
	pkg: {
		js: {
			merge1: [
				/js\/.*1\.js$/,
				'1.js'
			],

			base: /js\/.*/
		},

		css: {
			merge1: /\.css$/
		}
	}
};