/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var fs = require('fs'),
	path = require('path')
	// Images = require('images')

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
	upload : function( req, res){
		//可配置
		var dir = __dirname + "/../../assets/upload/";

		console.log("file",JSON.stringify(req.files.file) )
		Image.create({
			pid : "hjklkj",
			uid : '',
			name : req.files.file.name,
			type : req.files.file.type,
			addr: dir,
			size : req.files.file.size,
			caption : ''
		}).done(function( err, image){
			if( err ){
				console.log("ERR: add image record failed",err,image)
				res.send(500)
			}else{
				var newPath = dir + image.id
				fs.readFile(req.files.file.path, function (err, data) {
				  fs.writeFile(newPath, data, function (err) {
				  	if(err){
				  		console.log("write file err", err)
				  	}

				    res.json(image)
				  });
				});
			}
		})


	},

	thumb : function( req, res){
		var id = req.param('id')
			thumbWidth = 180
			thumbAddr = __dirname + "/../../assets/upload/thumb/";
		Image.findOne( id, function(err, image){
			if( err ){
				console.log('ERR: image record not exist')
				res.send(404)
			}else{
				fs.exists( path.resolve(image.addr + image.id), function(exists){
					if( !exists){
						console.log('ERR: image file not exist')
						res.send(404)
					}else{
						// Images( image.addr ).size(thumbWidth).save( thumbAddr + image.id,{quality : 90})
						res.type( image.type )
						// res.sendFile( thumbAddr + image.id )
						console.log("sending file", path.resolve(image.addr + image.id))
						res.sendfile( path.resolve(image.addr + image.id)  ) 
					}
				})
			}
		})
	}
};
