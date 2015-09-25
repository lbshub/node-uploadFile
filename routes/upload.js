var fs = require('fs');
var formidable = require('formidable');
function upload (req, res) {
	var q = req.query.q;
	var data = {
		"code": 0,
		"url": ''
	};
	if (q === 'iframe') {
		var callback = req.query.iframe;
		var cb = function(data) {
			return '<script type="text/javascript"> window.top.' + callback + '(' + JSON.stringify(data) + ');<\/script>';
		}
	}
	// console.log('====================='+ req.protocol +'://'+ req.hostname)
	var url = 'http://localhost:3000/';
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编码
	form.uploadDir = 'public/upload/images/'; //设置上传目录
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
	// form.multiples = true; //多文件支持
	form.on('progress', function(bytesReceived, bytesExpected) {
		var progress = bytesReceived / bytesExpected * 100 | 0;
		console.log(progress);
	});
	form.parse(req, function(err, fields, files) {
		if (err) {
			// res.locals.error = err;
			if (q === 'iframe') return res.send(cb(data));
			return res.json(data);
		}

		console.log(files) // 单个文件
		// console.log('==================== ' + files.files.name + ' ====================');

		var name = files.files.name;
		var extName = name.slice(name.lastIndexOf('.') + 1); //后缀名

		var fileName = Date.now() + '.' + extName;
		var newPath = form.uploadDir + fileName;
		fs.renameSync(files.files.path, newPath); //重命名

		// var filePath = form.uploadDir + files.files.name; //上传前的默认名
		// fs.renameSync(files.files.path, filePath); //重命名 （文件名为上传前的默认名）

		// res.locals.success = '上传成功';
		// res.render('update', {
		// 	title: '上传成功'
		// });

		data.code = 1;
		data.url = url + 'upload/images/' + fileName;
		if (q === 'iframe') return res.send(cb(data));
		return res.json(data);
	});
}

module.exports =  upload;