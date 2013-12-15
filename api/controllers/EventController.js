/**
 * EventController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var _ = require('underscore')
module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to EventController)
   */
  _config: {},

  eventWithPieces : function(req, res){
  	var result = {}, id = req.param('id')
  	if( id ){
		Event.findOne( id, function( err, event ){
			if( err ){
				console.log("ERR: load event error.")
				return res.json(event)
			}

			if( !(event.pieces instanceof Array) ) {
				console.log( "DEB: event.pieces is not array", event.pieces instanceof Array)
				return res.json(event)
			}else{
				var ids = event.pieces
				event.pieces = []
				Piece.find().where({id:ids}).exec(function( err, pieces){
					if( err ){
						console.log("ERR: load pieces error.")
						return res.json(event)
					}
					for( var i in pieces){
						var piece = _.pick(pieces[i],'title','id','metrics','summary')
						piece.summary = piece.summary || pieces[i].content
						event.pieces.push(pieces[i])
					}
					return res.json(event)
				})
			}
		})  		
  	}

  }
};
