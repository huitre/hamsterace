var H = (function () {

  this.mUtc = function (date) {
    return
    [
      [date.getFullYear(), date.getMonth(), date.getDate()].map(pad).join('-'),
      [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':')
    ].join(' ')
  },

  pad = function (n) {
    return n < 9 ? '0' + n : n;
  }


  this.hash = function () {
    return new Date().getTime() * Math.floor((Math.random() * 100) + 1) + (new Date().getTime() + '');
  }

  this.range = function (max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  this.paramsToObj = function (req, args) {
    var obj = {}
    if (req.hasOwnProperty('params')) {
      for (var i in args) {
        if (!req.params[args[i]])
          throw new Error('parameters ' + args[i] + ' is missing');
        obj[args[i]] = req.params[args[i]];
      }
    }
    return obj;
  }

  this.bodyToObj = function (req, args, unrequired) {
    var obj = {}
    if (req.hasOwnProperty('body')) {
      for (var i in args) {
        if (!req.body[args[i]])
          throw new Error('parameters ' + args[i] + ' is missing');
        obj[args[i]] = req.body[args[i]];
      }
      for (var i in unrequired) {
        if (req.body[unrequired[i]])
          obj[unrequired[i]] = req.body[unrequired[i]];
      }
    }
    return obj;
  }

  return this;
})()

if (typeof module !== 'undefined') {
  module.exports = H
}