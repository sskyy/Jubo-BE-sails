/**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
        uid: {
            type : 'string',
            defaultsTo : ''
        },
        title: {
            type:'string',
            required : true,
        },
        content : 'string',
        metrics : {
            type : 'json',
            defaultsTo : {}
        },
        pieces : {
            type:'array',
            defaultsTo : [],
        },
        args : {
            type : 'json',
            defaultsTo : {}
        },
        vote : {
            type : 'integer',
            defaultsTo : 0
        }

    },
    afterCreate:function( event,next ){
        //throw it into heatqueue
        Heat.create({
            entity_id : event.id,
            type : 'event'
        }).done(function(){
            console.log("DEB: event afterCreate done.")
            next()
        })
    }
};
