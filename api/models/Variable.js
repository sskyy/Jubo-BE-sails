/**
 * Variable
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    heatBoard : {
        type : 'array',
        defaultTo : []
    }
    heatBoardLimit : {
        type : 'integer',
        defaultTo : 10
    },
    heatQueueLimit : {
        type : 'integer',
        defaultTo: 100
    }

  }

};
