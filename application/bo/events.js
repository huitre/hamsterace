/*
 * This model is used to fetch, insert and update statistics 
 * sent by the Device
 */

var EventsModel = (function () {
  var pg = require('../models');

  var insert = function (req, events) {
    events.forEach(function (event) {
      var data = [event.type, event.time, event.value]
      pg("INSERT INTO DEVICE_EVENTS (TYPE, CREATED, CONTENT) VALUES ($1, to_timestamp($2), $3)", data, 
        function(err, rows, result) {
          if (err)
            req.send(err);
            console.log(err);
        }
      );
    })
  }

  return {
    insert : insert
  }
})();

if (typeof module !== 'undefined') {
  module.exports = EventsModel;
}