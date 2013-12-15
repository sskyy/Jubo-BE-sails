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
	}  

};
