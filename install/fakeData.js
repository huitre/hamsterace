var Db = require('../application/models'),
    Utils = require('../application/hra/lib/utils').RandomUtils;

var FakeData = (function () {

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
          content: {text : "Hey mate cette video, ca dechire !", video : "http://img-9gag-ftw.9cache.com/photo/aGV3m17_460sv.mp4"},
          PersonId: 3
        }).then(function (post) {
          Db.Comment.create({
            content: {text: "Effectivement, trop marrant quand il encule le chaton mort !"},
            PersonId: 1,
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
              eventDatas = [{
              type: 'lapsStart'},
            {
              type: 'laps',
              content : Utils.range(8, 12)
            }];

            for (var i = l; --i > 0;) {
              a = new Date(a.getTime() + Utils.range(2, 5));
              eventDatas.push({
                  type: 'laps',
                  content : Utils.range(8, 12),
                  createdAt : a,
                  DeviceId : device.id
                })
            }
            eventDatas.push({type: 'lapsStop'});

            return { datas : eventDatas, date : a }
          }

          // populate events
          var d = new Date(),
              b = r(d, 30);
          for (var i = 0; i < 50; i++) {
            Db.Event.bulkCreate(b.datas);
            d = b.date;
            b = r(d, Utils.range(30, 150));
          }

        })
        
      });
    }).catch(function (err) {
      console.log(err);
    })
  }
  return this;
})()

module.exports = FakeData;