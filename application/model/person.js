var PersonModel = (function () {
  /*
   * Requirements
   */
  var pg = require('../hra/database')(),
      crypto = require('crypto'),
      Utils = require('../hra/lib/utils'),
      bo = require('../hra/bo/person'),
      // config
      Config = require('config'),
      self = this;

  var person = {
    id : null,
    type : null,
    email : null,
    created : null,
    updated : null,
    firstName : null,
    name : null,
    avatar : {},
    fb : null,
    google : null
  }

  this.populate = function (params) {
    return person;
  }

  this.find = function (params, done) {
    var where = [], i = 1, p = [];

    for (var o in params) {
      where.push(o + " = $" + i);
      p.push(params[o]);
      i++;
    }
    
    bo.findQuery(where.join(' AND '), p, function (err, result) {
      if (err) return done(err)
      console.log(result)
      done(null, populate(result))
    })
  }

  this.findOne = function (params, done) {

  }

  this.findOneById = function (params, done) {

  }

  this.findAll = function (params, done) {

  }

  this.fbFindOne = function (params, done) {

  }

  this.count = function (params, done) {
    bo.count
  }

  this.insert = function (params, done) {
    bo.insert(params, done)
  }

  return this
})()

if (typeof module !== 'undefined') {
  module.exports = PersonModel;
}