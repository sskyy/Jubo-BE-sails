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
    Head.find().exec(function(err, list){
        for( var i = 0,length=list.length;i<length;i++){
            list[i].score = caculateScore( list[i].vote, list[i].createdAt)
        }
        var sortedList = _.sortBy(list,"score")

        //store the new heat result
        var newHeatBoard = _.first( sortedList, heatBoardLimit),
            heatEvents = _.pluck(_.filter( newHeatBoard, function( entity){
                return entity.type == 'event'
            }),"id"),
            heatPieces = _.pluck(_.filter( newHeatBoard, function( entity){
                return entity.type == 'piece'
            }),"id"),
            result = []
        
        Event.find().where({id:heatEvents}).exec(function(err, events ){
            result = result.concat( events)
            Piece.find().where({id:heatPieces}).exec(function(err,pieces){
                result = result.concat( pieces)
                res.json(result)
            })
        })
        //TODO clear the queue
    })
  }
};

function caculateScore( vote, time ){
    var now = parseInt(new Date.getTime()),
        then = parseInt( time.getTime()),
        hours = (now - then)/(1000*60*60)
    return vote/Math.pow(hours+1,1.5)
}
