/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */
var fs = require('fs'),
	path = require('path')

module.exports = {

	attributes: {
	    uid: {
	        type : 'string',
	        defaultsTo : '',
	    },
	    name : {
	    	type : 'string',
	    	defaultsTo : ''
	    },
	    type : {
	    	type : 'string',
	    	defaultsTo : ''
	    },
	    addr : {
	        type:'string',
	        required : true,
	    },
	    size : {
	    	type : 'integer',
	    	defaultsTo : 0
	    },
	    caption: {
	        type:'string',
	        defaultsTo : ''
	    }
	},
	beforeDestroy : function( criteria, next){
		if( criteria.where && _.isString(criteria.where.id) ){
			Image.findOne( criteria.where.id,function(err,image){
				if( err){
					console.log("ERR: image record not exist")
					next()
				}else{
					var fileAddr = path.resolve(image.addr+image.id)
					fs.exists( fileAddr , function(exists){
						if( !exists){
							next()
						}
						fs.unlink( fileAddr,function(err){
							next()
						})
					})
				}
			})
		}else{
			next()
		}
	}

	//TODO should automatically add uid

};
