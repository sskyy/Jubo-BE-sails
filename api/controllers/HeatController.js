/**
 * HeatController
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
var _ = require('lodash'),
    heatBoardLimit = 10,
    heatQueueLimit = 100
module.exports = {
  _config: {},
  digest : function(req,res){
    Heat.find().exec(function(err, heatList){
        //store the new heat result
        var heatEventIds = _.pluck(_.filter( heatList, function( entity){
                return entity.type == 'event'
            }),"entity_id"),
            heatPieceIds = _.pluck(_.filter( heatList, function( entity){
                return entity.type == 'piece'
            }),"entity_id"),
            list = []
        
        Event.find().where({id:heatEventIds}).exec(function(err, events ){
            list = list.concat( events)
            Piece.find().where({id:heatPieceIds}).exec(function(err,pieces){
                list = list.concat( pieces)

                for( var i = 0,length=list.length;i<length;i++){
                    list[i].score = caculateScore( list[i].vote, list[i].createdAt)
                }
                var newBoard = list.sort(function(b,a){return (a.score-b.score)>0})

                //store the result
                Tmp.update({
                    key : 'heatBoard'},{
                    value : list
                }).done(function(){
                    res.json( _.first(newBoard,heatBoardLimit))
                })

                //TODO clear the queue

            })
        })
    })
  },
    board : function(req,res){
        Tmp.findOne({key:'heatBoard'},function(err,tmp){
            if( err){
                return res.send("500",{msg:"error find event"})
            }
            var list = _.values(tmp.value)
            if( list.length == 0 ){
                return res.json(list)
            }else{
                var uids = _.uniq(_.compact(_.pluck( list,"uid" )))
                User.find().where({id:uids}).exec(function(err,users){
                    //rescadule data structure
                    if( err ){
                        console.log("finding user err")
                        return res.json(events)
                    }

                    users = _.indexBy( users, "id")
                    return res.json( list.map(function(entity){
                        if( users[entity.uid] ){
                            entity.author = _.pick(users[entity.uid],"id","name")
                        }
                        return entity
                    }))
                })
            }

        })
    }
};

function caculateScore( vote, time ){
    var now = parseInt(new Date().getTime()),
        then = parseInt( time.getTime()),
        hours = (now - then)/(1000*60*60)
    return vote/Math.pow(hours+1,1.5)
}
