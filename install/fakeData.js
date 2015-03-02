var Db = require('../application/models'),
    Utils = require('../application/hra/lib/utils').RandomUtils,
    Moment = require('moment');

var FakeData = (function () {

  this.populateStats = function (id) {
    id = id || 1;
    var r = function (s, l) {
        var a = s || new Date(),
            eventDatas = [];

        a = Moment(a);

        for (var i = l; --i > 0;) {
          a.add(Utils.range(2000, 15000), 's');
          eventDatas.push({
            type: 'lapsStart',
            DeviceId: id,
            createdAt : a
          });

          for (var j = Utils.range(5, 20); --j > 0;) {
            a.add(Utils.range(50, 80), 's');
            eventDatas.push({
                type: 'laps',
                content : Utils.range(90, 120),
                createdAt : a.toISOString(),
                DeviceId : id
              })
          }
          eventDatas.push({
            type: 'lapsStop',
            DeviceId: id,
            createdAt : a
          });
        }
        return { datas : eventDatas, date : a }
      }

      // populate events
      var d = new Date();
      b = r(d, Utils.range(10, 30));
      Db.Event.bulkCreate(b.datas);
  }

  this.populate = function () {


    var PersonData = [{
        email : 'toto@toto.com',
        password : 'toto1'
      },{
        email : 'toti@toto.com',
        password : 'toto2'
      },{
        email : 'tato@toto.com',
        password : 'toto3'
      },{
        email : 'tata@toto.com',
        password : 'toto4'
      }];

    Db.Person.bulkCreate(PersonData).then(function (Persons) {
      var DetailsData = [
          {
            type : 'hamster',
            name : 'Rabotin',
            firstname : 'Arthur',
            gender : 'male',
            age : new Date('1984-11-11'),
            PersonId: 1
          },
          {
            type : 'hamster',
            name : 'bahl',
            firstname : 'Trou2',
            gender : 'male',
            age : new Date('1984-11-11'),
            PersonId: 2
          },
          {
            type : 'hamster',
            name : 'bahl',
            firstname : 'Trou2',
            gender : 'male',
            age : new Date('1984-11-11'),
            PersonId: 3
          },
          {
            type : 'hamster',
            name : '34',
            firstname : 'Popol',
            gender : 'male',
            age : new Date('1984-11-11'),
            PersonId: 4
          }];
      Db.PersonDetails.bulkCreate(DetailsData).then(function (Details) {
        Db.Post.create({
          content : {text: "J'ai couru 34 km hier ! Un vrai record, mais je suis mort ! LOL !"},
          PersonId: 1
        })
        Db.Post.create({
          content : {text: "Je roxx trop du poney !"},
          PersonId: 1
        })
        Db.Post.create({
          content : {text: "Je suis Josephine ange gardien de la paix !"},
          PersonId: 1
        })
        Db.Post.create({
          content: {text : "Hey mate cette video, ca dechire !", video : "http://img-9gag-ftw.9cache.com/photo/aGV3m17_460sv.mp4"},
          PersonId: 3
        }).then(function (post) {
          Db.Comment.create({
            content: {text: "Effectivement, trop marrant quand il encule le chaton mort !"},
            PersonId: 1,
            PostId: post.id
          })
          Db.Comment.create({
            content: {text: "Ouais, mais le mieux c'est quand il le mange xD !"},
            PersonId: 2,
            PostId: post.id
          })
        })

        Db.PeopleFriend.create({
          PersonId: 1,
          FriendId: 3,
          confirmed: true
        })

        Db.PeopleFriend.create({
          PersonId: 4,
          FriendId: 2,
          confirmed: true
        })
        
        Db.PeopleFriend.create({
          PersonId: 2,
          FriendId: 3,
          confirmed: true
        })

        
        // populate device
        Db.Device.create({
          apiKey: 4242,
          userKey: 'azerty',
          privateKey: 'keyboardcat'
        }).then(function (device) {
          // then attach device to Person
          Db.RegisteredDevice.create({
            hash: 'thisisafakehashfortesting',
            PersonId: 1,
            DeviceId: device.id
          })

          var r = function (s, l) {
            var a = s || new Date(),
                eventDatas = [];

            a = Moment(a);

            for (var i = l; --i > 0;) {
              a.add(Utils.range(2000, 15000), 's');
              eventDatas.push({
                type: 'lapsStart',
                DeviceId: device.id,
                createdAt : a
              });

              for (var j = Utils.range(5, 20); --j > 0;) {
                a.add(Utils.range(50, 80), 's');
                eventDatas.push({
                    type: 'laps',
                    content : Utils.range(90, 120),
                    createdAt : a.toISOString(),
                    DeviceId : device.id
                  })
              }
              eventDatas.push({
                type: 'lapsStop',
                DeviceId: device.id,
                createdAt : a
              });
            }
            return { datas : eventDatas, date : a }
          }

          // populate events
          var d = new Date();
          b = r(d, Utils.range(10, 30));
          Db.Event.bulkCreate(b.datas);
        })
        
      });
    }).catch(function (err) {
      console.log(err);
    })
  }
  return this;
})()

module.exports = FakeData;