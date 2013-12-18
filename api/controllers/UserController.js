/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},
  connect : function( req, res){
    if( req.session.user && req.session.user.id ){
      return res.json( req.session.user )
    }

    return res.json({
        id:0, 
        name : 'anonymous'
    })
  },
  login : function(req, res){
    var name = req.param('name'),
        password = req.param('password')

    if( req.session.user && req.session.user.id ){
      return res.send(200, req.session.user)
    }

    if( !name || !password ){
      return res.send(404)
    }else{
      var where = {password:EncryptService.encrypt(password)},
          idField = name.indexOf("@") == -1 ? 'name' : 'email';
      where[idField] = name

      User.findOne(where).done(function(err, user){
        if( err ){
          return res.send(500)
        }else{
          req.session.user = user
          user.lastLogin = new Date()
          user.save(function(err){
            console.log("lastLogin saved")
          })
          return res.send(200, _.pick(user,"id","name","email"))
        }
      })
    }
  },
  register : function( req,res){
    var name = req.param('name'),
        password = req.param('password'),
        email = req.param('email')

    if( !name || !password || !email){
      return res.send(406,{msg:"information not enough"})
    }
    User.find({name:name},function(err,users){
      if(err){
        return res.send(500,{msg:"checking name or email failed",err:err}) 
      }
      if( users.length == 0 ){
          User.create({
          name : name,
          password : password,
          email : email
        }).done(function(err, user){
          if( err ){
            res.send(500,err)
          }else{
            res.send(200)
          }
        })
      }else{
        return res.send(409,{msg:"用户名或邮箱已存在"})
      }

    })

  },
  checkname: function(req,res){
    var name = req.param('name')
    User.findOne({name:name},function(err, user){
      if( err ){
        return res.send(500)
      }
      if( user ){
        return res.send(200)
      }else{
        return res.send(404,{msg:'name not found'})
      }
    })
  },
  checkemail: function(req,res){
    var email = req.param('email')
    User.findOne({email:email},function(err, user){
      if( err ){
        return res.send(500)
      }
      if( user ){
        return res.send(200)
      }else{
        return res.send(404,{msg:'email not found'})
      }
    })
  },
  logout : function( req, res){
    if( !req.session.user || !req.session.user.id ){
      res.send(404)
    }else{
      req.session = null
      res.send(200)
    }
  }
};
