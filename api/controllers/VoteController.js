/**
 * VoteController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
	toEvent : function(req,res){
		return voteToEntity( req,res, 'event')

	},
	toPiece : function(req,res){
		return voteToEntity( req,res, 'piece')
	}
};

function voteToEntity( req,res,type){
	if( !req.param('id') ){
		return res.send(406)
	}

	if( !req.session.user.id ){
		return res.send(401)
	}

	Vote.findOne({entity_id:req.param('id'),uid:req.session.user.id,type:type},function(err, vote){
		if( vote ){
			return res.send(409)
		}

	  	Vote.create({
	  		entity_id : req.param('id'),
	  		uid : req.session.user.id,
	  		type : type
	  	}).done(function( err, vote ){
	  		if( err ){
	  			return res.send(500)
	  		}
	  		return res.send(200)
	  	})
	})
}
