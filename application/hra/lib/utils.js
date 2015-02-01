var DateUtils = (function () {

  var mUtc = function (date) {
    return
    [
      [date.getFullYear(), date.getMonth(), date.getDate()].map(pad).join('-'),
      [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':')
    ].join(' ')
  },

  pad = function (n) {
    return n < 9 ? '0' + n : n;
  }

  return {
    toMandrillUTC: mUtc
  }
})()


var RandomUtils = (function () {
  this.hash = function () {
    return new Date().getTime() * Math.floor((Math.random() * 100) + 1) + (new Date().getTime() + '');
  }

  this.range = function (max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return this
})()

if (typeof module !== 'undefined') {
  module.exports.DateUtils = DateUtils
  module.exports.RandomUtils = RandomUtils
}