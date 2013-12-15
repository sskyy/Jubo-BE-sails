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
        }

    },


    beforeCreate: function( event, next) {
        event._csrf &&delete event._csrf
        next();
    }


};
