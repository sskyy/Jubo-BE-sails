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
	},
	create : function( req, res){
		if( !req.session.user ||!req.session.user.id){
		    return next({msg:"user not logged in"});
		}

		if( !req.param("title") || !req.param("content") ){
			return res.send(406,{msg:"information not enough"})
		}

		Event.create({
			title : req.param('title'),
			content : req.param('content'),
			uid : req.session.user.id
		}).done(function(err, event){
			if( err ){
				return res.send(500,{msg:"event create failed"})
			}

			res.json(event)
		}) 
	},
	delete:function(req,res){
		if( !req.session.user ||!req.session.user.id){
		    return res.send(401,{msg:"user not logged in"});
		}

		if( !req.param("id") ){
			return res.send(406,{msg:"information not enough"})
		}

		Event.findOne( req.param("id"),function( err, event){
			if( err || !event ){
				return res.send("500",{msg:"error find event"})
			}
			if( event.uid != req.session.user.id ){
				return res.send(406,{msg:"you are not the author"})
			}
			event.destroy(function(){
				return res.send(200,{msg:"event delete success"})
			})
		})
	},
	myEvents : function(req,res){
		if( !req.session.user || !req.session.user.id ){
		    return res.send(401,{msg:"user not logged in",user:req.session.user});
		}
		var uid = req.session.user.id
		Event.find({uid:uid},function(err,events){
			if( err){
				return res.send("500",{msg:"error find event"})
			}
			res.json(events)
		})
	},
	ranking : function(req,res){
		Event.find().limit(10).sort({ createdAt: 'desc' }).exec(function(err,events){
			if( err){
				return res.send("500",{msg:"error find event"})
			}
			if( events.length == 0 ){
				return res.json(events)
			}else{
				var uids = _.uniq(_.compact(_.pluck( events,"uid" )))
				User.find().where({id:uids}).exec(function(err,users){
					//rescadule data structure
					if( err ){
						console.log("finding user err")
						return res.json(events)
					}

					users = _.indexBy( users, "id")
					return res.json( events.map(function(event){
						if( users[event.uid] ){
							event.author = _.pick(users[event.uid],"id","name")
						}
						return event
					}))
				})
			}

		})
	}

};
