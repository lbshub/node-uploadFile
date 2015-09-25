var fs = require('fs');
var formidable = require('formidable');

var upload = require('./upload'); // 处理单个文件
var uploadBlob = require('./upload-blob'); // 处理断点流 单个文件

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title: 'ajax文件上传断点续传'
		});
	});
	app.post('/', uploadBlob);

	// ----------------------------------------------------------
	app.get('/upload', function(req, res) {
		res.render('upload', {
			title: '文件上传'
		});
	});
	app.post('/upload', upload);
	
	// ----------------------------------------------------------
}