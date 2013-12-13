/**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
    id: 'integer',
    uid: {
        type : 'integer',
        defaultsTo : 0
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
    
  }

};
