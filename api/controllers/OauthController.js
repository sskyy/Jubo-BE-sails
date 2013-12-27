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
				redirect_uri:encodeURIComponent("http://www.buxiache.com:1337/oauth/douban"),
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
								res.redirect("http://www.buxiache.com:9000")
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
								res.redirect("http://www.buxiache.com:9000")
							})

						})
					}
				})


			})

		})
	},
	weibo : function(req,res){
		var code = req.query.code,
		    client_id = "2773636773",
		    secret = "6a55cc27f6f91699e540b7aedc044a74"

		if( !code ){
			return  res.send(401,"user not authorized.")
		}

		request({
			uri : 'https://api.weibo.com/oauth2/access_token',
			method : "POST",
			form:{
				client_id:client_id,
				client_secret:secret,
				redirect_uri:"http://www.buxiache.com:1337/oauth/weibo",
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
			var access_token = body.access_token
			console.log("get access_token",body)

			//get user info
			request({
				url : "https://api.weibo.com/2/account/get_uid.json",
				qs : {
			  		"access_token":access_token
				}
			},function( err, response, body){
				if( err){
			  		return res.send(401,{msg:"get user info failed",err:err})
				}

				body= JSON.parse( body)
				if( !body.uid ){
			  		return res.send(401,{msg:body})
				}

				var uid = body.uid,
					snsId= "weibo"+uid

				Oauth.findOne({snsId:snsId},function(err,oauthUser){
					if( oauthUser ){
						console.log("user already logined with douban")
						User.findOne(oauthUser.localId,function(err, localUser){
							if( localUser ){
								console.log("found local user",JSON.stringify(localUser))
								req.session.user = localUser
								res.redirect("http://www.buxiache.com:9000")
							}else{
								res.send(404,"record error, local user not found")
								//TODO deal with data mistake
							}
						})
					}else{
						console.log("new user logined with weibo")

						request({
							url : "https://api.weibo.com/2/users/show.json",
							qs : {
								access_token : access_token,
								uid : uid
							}
						},function(err, response, body){
							var user = JSON.parse(body),
								newUser = {
									name : user.name,
									avatar : user.avatar_large,
									sign :user.description,
									sns : {
										weibo : user.url
									},
									lastLogin : new Date()
								}

							User.create(newUser).done(function(err,localUser){
								if( err ){
									return res.send(500,"create local user failed")
								}
								user.snsId = "weibo" + user.id
								user.localId = localUser.id
								Oauth.create( user,function(err, oauthUser){
									if( err ){
										return res.send(500,"create oauth user failed")
									}
									console.log("all done")
									req.session.user = localUser
									res.redirect("http://www.buxiache.com:9000")
								})

							})
						})


					}
				})


			})

		})
	},
	google:function(req,res){
		var code = req.query.code,
		    client_id = "684503587554-ln51ean53ghos3culpjvh5ehggjvh6bd.apps.googleusercontent.com",
		    secret = "NsIDa99cer39Gw8vGtJMoJcM"

		if( !code ){
			return  res.send(401,"user not authorized.")
		}

		request({
			uri : 'https://accounts.google.com/o/oauth2/token',
			method : "POST",
			form:{
				client_id:client_id,
				client_secret:secret,
				redirect_uri:encodeURIComponent("http://www.buxiache.com:1337/oauth/google"),
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
				url : "https://www.googleapis.com/plus/v1/people/me",
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


				var snsId= "google"+user.id
				Oauth.findOne({snsId:snsId},function(err,oauthUser){
					if( oauthUser ){
						console.log("user already logined with google")
						User.findOne(oauthUser.localId,function(err, localUser){
							if( localUser ){
								console.log("found local user",JSON.stringify(localUser))
								req.session.user = localUser
								res.redirect("http://www.buxiache.com:9000")
							}else{
								res.send(404,"record error, local user not found")
								//TODO deal with data mistake
							}
						})
					}else{
						console.log("new user logined with google")

						var newUser = _.pick( user, 'name','avatar')
						newUser.sign = user.desc
						newUser.sns = {
							google : user.alt
						}
						newUser.lastLogin = new Date()

						User.create(newUser).done(function(err,localUser){
							if( err ){
								return res.send(500,"create local user failed")
							}
							user.snsId = "google" + user.id
							user.localId = localUser.id
							Oauth.create( user,function(err, oauthUser){
								if( err ){
									return res.send(500,"create oauth user failed")
								}
								console.log("all done")
								req.session.user = localUser
								res.redirect("http://www.buxiache.com:9000")
							})

						})
					}
				})


			})

		})
	}
};

