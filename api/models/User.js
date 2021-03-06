/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
module.exports = {

    attributes: {
        name : {
            type : 'string',
            required : true
        },
        password : {
            type : 'binary'
        },
        email : {
            type :'string'
        },
        sns : {
        	type: 'json'
        },
        avatar : {
        	type : 'string'
        },
        sign : {
        	type : 'string'
        },
        lastLogin : {
            type : 'date'
        },
        isActive : {
            type : 'boolean',
            defaultTo : true
        }
    },
    beforeCreate: function(values, next) {
    	//allow empty password for users logged in with openid
    	if( values.password ){
	        values.password = EncryptService.encrypt(values.password) 
    	}
        next()
    }

};
