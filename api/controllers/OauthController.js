/**
 * OauthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var request = require('request')
module.exports = {

	douban : function(req,res){
		var code = req.query.code,
		    client_id = "0be4d525ee8ea80523ae7f71cbabf80f",
		    secret = "6121e4cc409c9b1c"

		if( !code ){
			return  res.send(401,"user not authorized.")
		}

		request({
			uri : 'https://www.douban.com/service/auth2/token',
			method : "POST",
			form:{
				client_id:client_id,
				client_secret:secret,
				redirect_uri:encodeURIComponent("http://127.0.0.1:1337/oauth/douban"),
				grant_type:"authorization_code",
				code:code
			}
		},function( err, response, body){
			if( err ){
				return res.send(401,{msg:"sending request for access token failed",err:err})
			}

			body = JSON.parse( body )
			if( body.code ){
				return res.send(401,{msg:body.msg})
			}

			// console.log("get access_token",body.access_token)

			//get user info
			request({
				url : "https://api.douban.com/v2/user/~me",
				headers : {
			  		"Authorization": "Bearer "+body.access_token
				}
			},function( err, response, body){
				if( err){
			  		return res.send(401,{msg:"get user info failed",err:err})
				}

				var user= JSON.parse( body)
				if( user.code ){
			  		return res.send(401,{msg:user.msg})
				}


				var snsId= "douban"+user.id
				Oauth.findOne({snsId:snsId},function(err,oauthUser){
					if( oauthUser ){
						console.log("user already logined with douban")
						User.findOne(oauthUser.localId,function(err, localUser){
							if( localUser ){
								console.log("found local user",JSON.stringify(localUser))
								req.session.user = localUser
								res.redirect("http://127.0.0.1:9000")
							}else{
								res.send(404,"record error, local user not found")
								//TODO deal with data mistake
							}
						})
					}else{
						console.log("new user logined with douban")

						var newUser = _.pick( user, 'name','avatar')
						newUser.sign = user.desc
						newUser.sns = {
							douban : user.alt
						}
						newUser.lastLogin = new Date()

						User.create(newUser).done(function(err,localUser){
							if( err ){
								return res.send(500,"create local user failed")
							}
							user.snsId = "douban" + user.id
							user.localId = localUser.id
							Oauth.create( user,function(err, oauthUser){
								if( err ){
									return res.send(500,"create oauth user failed")
								}
								console.log("all done")
								req.session.user = localUser
								res.redirect("http://127.0.0.1:9000")
							})

						})
					}
				})


			})

		})
	}
};

