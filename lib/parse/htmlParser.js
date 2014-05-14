var autobuild = require('../core/autobuild.js');
var CommonParser = require('./commonParser.js');

var HtmlParser = autobuild.util.inherits({
	
});

var HtmlParsers = autobuild.util.inherits({
	extend: CommonParser,

	_parse: function(file){
		var self = this;
		var info = CommonParser.prototype._parse.apply(self, arguments);
	},
});

function HtmlParse(file){
	CommonParse.call(this, file);
}

autobuild.util.inherits(HtmlParse, CommonParse);

HtmlParse.prototype.parse = function(){
	var content = autobuild.file.readFileSync(this.file, 'utf-8');
	content = this.parseJs(content);
	content = this.parseCss(content);

	autobuild.file.writeFileSync(this.file, content);
};

HtmlParse.prototype.parseJs = function(content){
	var self = this;

	return content.replace(/<script([^>]*)>/g, function(_0, _1){
		if(_1){
			_1 = _1.replace(/src=(['"])((?:(?!\1).)+)\1/, function(_0, _1, _2){
				var jsInfo = require('./jsParse.js').init(autobuild.path.resolve(autobuild.path.dirname(self.file), _2));
				//require('./parse.js').parse(filename);
				return jsInfo ? 'src="' + jsInfo.webpath + '"' : _0;
			});

			return '<script' + _1 + '>';
		}

		return _0;
	});
};

HtmlParse.prototype.parseCss = function(content){
	var self = this;

	return content.replace(/<link([^>]*)>/g, function(_0, _1){
		if(_1){
			_1 = _1.replace(/href=(['"])((?:(?!\1).)+)\1/, function(_0, _1, _2){
				var cssInfo = require('./cssParse.js').init(autobuild.path.resolve(autobuild.path.dirname(self.file), _2));
				return cssInfo ? 'href="' + cssInfo.webpath + '"' : _0;
			});

			return '<link' + _1 + '>';
		}

		return _0;
	});
};

var instance;

module.exports = {
	init: function(files){
		return instance || (instance = new JsParse(files));
	}
};