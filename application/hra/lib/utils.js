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

if (typeof module !== 'undefined') {
  module.exports.DateUtils = DateUtils;
}