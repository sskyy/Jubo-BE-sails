/**
 * Vote
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    entity_id : {
    	type : "string",
    	required : true
    },
    uid : {
    	type : "string",
    	required : true
    },
    type : {
    	type : "string",
    	required : true
    }
  },
  beforeCreate : function( vote, next ){
  	var Entity = vote.type == 'event' ? Event : Piece

  	Entity.findOne( vote.entity_id,function( err, entity ){
  		if( entity ){
  			entity.vote = entity.vote || 0
  			entity.vote++
  			entity.save(function(){
  				
  			})	
  		}
  		next()
  	})
  }

};
