/**
 * Piece
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  	attributes: {
  	
	    uid: {
	        type : 'string',
	        defaultsTo : '',
	    },
	    eid : {
	    	type : 'string',
	    	defaultsTo : '',
	    	required : true
	    },
	    title: {
	        type:'string',
	        required : true,
	    },
	    summary : 'string',
	    content : 'string',
	    cover : {
	    	type : 'string',
	    	defaultsTo : ''
	    },
	    pics : {
	        type : 'array',
	        defaultsTo : []
	    },
	    metrics : {
	        type : 'json',
	        defaultsTo : {}
	    },
	    vote : {
	    	type : 'integer',
	    	defaultsTo : 0
	    }
	    
	},
  	beforeCreate: function( piece, next) {
  		piece._csrf && delete piece._csrf
  		if( !piece.cover && piece.pics.length > 0){
  			piece.cover = piece.pics[0]
  		}
    	next()
    },

    afterCreate : function( piece, next ){
    	if( piece.eid ){
	        Event.findOne(piece.eid,function( err, event){
	        	if( err || !event ){
	        		console.log("ERR, pieces created for a invalid event", piece.eid)
	        		return next()
	        	}

	        	_.each(piece.metrics,function( metircVal, metricName){
	        		if( event.metrics[metricName] === undefined ){
	        			event.metrics[metricName] = {
	        				top :metircVal,
	        				bottom :metircVal
	        			}
	        		}else{
	        			if( metircVal > event.metrics[metricName].top){
	        				event.metrics[metricName].top = metircVal
	        			}else if( metircVal < event.metrics[metricName].bottom){
	        				event.metrics[metricName].bottom = metircVal
	        			}
	        		}
	        	})

	        	event.pieces.push(piece.id)
	        	//tricks, 'save' must have a callback
	        	event.save(function(){
	        		console.log("DEB: event saved")
	        	})

                //throw it into heatqueue
                Heat.create({
                    entity_id : piece.id,
                    type : 'piece'
                }).done(function(){
                    console.log("DEB: piece afterCreate done.")
                    next()
                })
	        })
    	}else{
    		console.log("DEB: piece afterCreate, have no eid.")
	        next()
        		
    	}
    }
};
