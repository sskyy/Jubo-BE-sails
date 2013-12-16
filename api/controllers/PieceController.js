/**
 * PieceController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var _ = require('underscore');

module.exports = {
	_config: {},

  	//support batch id get 
	piecesById: function( req, res ){
		var ids = req.query.ids.split(','),
			pieces = []

		if(  typeof ids == Array ) {
			Piece.findById(ids,function(res){
				for( var i in res){
					var piece = _.pick(res[i],'id','title','metrics','summary')
					piece.summary = piece.summary || piece.content
					pieces.push(piece)
				}
				res.json(pieces)
			})
		}else{
			res.json(pieces)
		}
	},
	pieceWithPics : function(req, res){
		var id = req.param('id')
		Piece.findOne( id, function(err, piece){
			if( err ){
				console.log("ERR: piece not found",id)
				return res.send(404)
			}

			if( piece.pics.length > 0 ){
				Image.find().where({id:piece.pics}).exec(function( err, images){
					if( err ){
						console.log("ERR: read pics for piece failed")
						piece.pics = []
					}
					piece.pics = images
					return res.json(piece)
				})
			}
		})
	}  

};
