/* 
* @Author: huitre
* @Date:   2015-07-15 20:34:25
* @Last Modified by:   huitre
* @Last Modified time: 2015-07-15 21:00:18
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
BadgesModel.prototype.getBadges = function (User, done) { 
}

/*
 * Listen for all badges type events
 */
BadgesModel.prototype.listen = function () {
  this.on('Stats.increase', this.checkForStatsBadges)
  this.on('Friends.add', this.checkFriendBadges)
}

BadgesModel.prototype.checkForStatsBadges = function () {

}

BadgesModel.prototype.checkFriendBadges = function(event) {
  debugger;
};



if (typeof module !== 'undefined') {
  module.exports = new BadgesModel;
}