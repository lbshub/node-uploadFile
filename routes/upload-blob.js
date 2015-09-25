var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

function uploadBlob (req, res) {
 	var tmpFiles = [],
        files = [],
        map = {},
        uploadDir = 'public/upload/images/';
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编码
	form.uploadDir =  uploadDir; //设置上传目录
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
	form.multiples = true; //多文件支持
	
	form.on('fileBegin', function (name, file) {
		var fileInfo = {
			name: file.name,
			size: file.size,
			type: file.type,
			path: file.path
		}
		console.log('=======================name开始'+ name +'=======================')
		console.log('=======================size开始'+ fileInfo.size +'=======================')
        tmpFiles.push(file.path);
        map[path.basename(file.path)] = fileInfo;
        files.push(fileInfo);
    });
	form.on('file', function (name, file) {
        var fileInfo = map[path.basename(file.path)];
        fileInfo.size = file.size;

        var name = file.name;
		var extName = name.slice(name.lastIndexOf('.') + 1); 
        var newName = Date.now() + '.' + extName;
		
		fs.renameSync(file.path, uploadDir + newName); 
       
        console.log('=======================文件'+ JSON.stringify(file) +'=======================')
        // console.log('=======================文件路径'+ file.path +'=======================')
        // console.log('=======================文件大小'+ file.size +'=======================')
    });
	form.on('progress', function (bytesReceived, bytesExpected) {
		var progress = bytesReceived / bytesExpected * 100 | 0;
    	console.log('=======================进度'+ progress +'=======================')
    });
    form.on('end', function() {
    	console.log('=======================文件大小'+ files[0].size +'=======================')
		res.json({code: 1});
	});
    form.parse(req,function(err,fields,files){
    	console.log('=======================files '+ JSON.stringify(files) +'=======================')
    });

	// form.parse(req, function(err, fields, files) {
	// 	if (err)  return res.json({code: 0});
		
	// 	console.log('==================== ' + files.files.name + ' ====================');

	// 	var name = files.files.name;
	// 	var extName = name.slice(name.lastIndexOf('.') + 1); //后缀名

	// 	var fileName = Date.now() + '.' + extName;
	// 	var newPath = form.uploadDir + fileName;
	// 	fs.renameSync(files.files.path, newPath); //重命名

	// 	// var filePath = form.uploadDir + files.files.name; //上传前的默认名
	// 	// fs.renameSync(files.files.path, filePath); //重命名 （文件名为上传前的默认名）

	// 	return res.json({"succ": true, "msg": "文件上传成功"});
	// });
    
    // -----------------------------------------------------------------

}

module.exports =  uploadBlob;