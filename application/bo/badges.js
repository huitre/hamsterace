/* 
* @Author: huitre
* @Date:   2015-07-15 20:34:25
* @Last Modified by:   joffrey.gohin
* @Last Modified time: 2015-07-16 17:52:02
*/

/*
 * Requirements
 */
var Db = require('../models'),
    Person = require('../bo/person'),
    crypto = require('crypto'),
    events = require('events'),
    console = require('console-plus');

var BadgesModel = function () {}

BadgesModel.prototype = Object.create(events.EventEmitter.prototype);


/**
 *
 */
BadgesModel.prototype.getBadges = function (UserId) {
	return Db.Badge.findAll({
		where: {
			PersonId: UserId,
			$or: {
        state : ['unlocked', 'revealed']
      }
		}
	})
}

/*
 * Listen for all badges type events
 */
BadgesModel.prototype.listen = function () {
  this.on('Stats.increase', this.checkForStatsBadges)
  this.on('Friends.add', this.checkFriendBadges)
  this.on('Feed.firstPost', this.checkFeedFirstPostBadges)
}

BadgesModel.prototype.checkForStatsBadges = function () {

}

BadgesModel.prototype.checkFriendBadges = function(event) {

};

BadgesModel.prototype.checkFeedFirstPostBadges = function (event) {
  console.log('YEAH FIRST POST !')
}

BadgesModel.prototype.addBadges = function (obj) {
  return db.Badge.create(obj)
}



if (typeof module !== 'undefined') {
  module.exports = new BadgesModel;
}