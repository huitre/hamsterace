var Db = require('../application/models'),
    Utils = require('../application/hra/lib/utils').RandomUtils,
    Moment = require('moment');

var FakeData = (function () {
  var self = this;

  this.populateAvatar = function () {
    for (var i = 1; i < 30; ++i) {
      Db.Image.create({
        resource : "images/hamster.png",
        size : {w: 300, h: 300},
        type : "image/jpeg"
      }).then(function (image) {
        Db.Avatar.create({
          length : 1,
          PersonId: image.id,
          ImageId: image.id
        })
      })
    }
  }

  this.populateDevice = function () {
    // populate device
    for (var i = 1; i < 30; ++i) {
      Db.Device.create({
        apiKey: 4242,
        userKey: 'azerty',
        privateKey: 'keyboardcat'
      }).then(function (device) {
        // then attach device to Person
        Db.RegisteredDevice.create({
          hash: 'thisisafakehashfortesting',
          PersonId: device.id,
          DeviceId: device.id
        })
        self.populateStats(device.id);
      })    
    }
  }

  this.incrementStats = function () {
    var d = Moment().hours(0).minutes(0).seconds(0),
        self = this;

    Db.Event.max('updatedAt').then(function (updatedAt) {
      if (new Date(updatedAt) < d) {
        Db.Event.findAll({attributes : ['DeviceId'], group : ['DeviceId']}, {raw: true}).then(function (rows) {
          for (var i = rows.length - 1; i > -1; --i) {
            self.populateStats(rows[i].DeviceId, Moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).format())
          }
        })
      }
      
    })
  }

  this.populateStats = function (id, date) {
    id = id || 1;
    /*
     * @params Date s Start date to populate data
     * @params int l number of events
     */
    var r = function (s, l) {
        var a = s || new Date(),
            eventDatas = [];

        a = Moment(a);

        for (var i = l; --i > 0;) {
          eventDatas.push({
            type: 'lapsStart',
            DeviceId: id,
            createdAt : a.toISOString()
          });
          for (var j = Utils.range(1, 5); --j > 0;) {
            a.add(60 * 5, 's');
            eventDatas.push({
                type: 'laps',
                content : Utils.range(50 * 5, 90 * 5),
                createdAt : a.toISOString(),
                DeviceId : id
              })
          }
          a.add(60 * 5, 's');
          eventDatas.push({
            type: 'lapsStop',
            DeviceId: id,
            createdAt : a.toISOString()
          });
          // we shift the date for 2-30minutes before next event
          a.add(Utils.range(2, 30 * 60), 's');
        }
        return { datas : eventDatas, date : a }
      }

      // populate events
      //var d = Moment().subtract(1, 'months').hours(0).minutes(0).seconds(0).format();
      var d = date || Moment().subtract(1, 'weeks').hours(0).minutes(0).seconds(0).format();
      //for (var x = 0; x < 31; ++x) {
      for (var x = 0; x < 7; ++x) {
        b = r(d, Utils.range(1, 2 * 60));
        Db.Event.bulkCreate(b.datas);
        d = Moment(d).add(1, 'days').format();
      }
  }

  this.populate = function () {


    var PersonData = [{
        "email" : 'toto@toto.com',
        "password" : 'toto1'
      },{
        "email" : 'toti@toto.com',
        "password" : 'toto2'
      },{
        "email" : 'tato@toto.com',
        "password" : 'toto3'
      },{
        "email" : 'tata@toto.com',
        "password" : 'toto4'
      },
      {
        "password": "Orla",
        "email": "sollicitudin.orci.sem@sedpede.ca"
      },
      {
        "password": "Octavia",
        "email": "vestibulum@sitametmassa.ca"
      },
      {
        "password": "Heather",
        "email": "scelerisque@tempus.ca"
      },
      {
        "password": "Merritt",
        "email": "nec.ante.blandit@sapienimperdietornare.org"
      },
      {
        "password": "Hayes",
        "email": "aliquam.eros@fermentumvelmauris.com"
      },
      {
        "password": "Lila",
        "email": "diam.nunc@mollis.edu"
      },
      {
        "password": "Abbot",
        "email": "sed.hendrerit.a@non.org"
      },
      {
        "password": "Ariel",
        "email": "nisi.nibh@magnisdis.ca"
      },
      {
        "password": "Barrett",
        "email": "varius.orci.in@vel.org"
      },
      {
        "password": "Klad",
        "email": "klad.orci.in@vel.org"
      },
      {
        "password": "Tara",
        "email": "Quisque.tincidunt@luctusfelis.edu"
      },
      {
        "password": "Miranda",
        "email": "In@sollicitudin.edu"
      },
      {
        "password": "Orson",
        "email": "Etiam@Uttinciduntvehicula.co.uk"
      },
      {
        "password": "Graiden",
        "email": "eu@et.com"
      },
      {
        "password": "Yvonne",
        "email": "eget.ipsum@eu.com"
      },
      {
        "password": "Eric",
        "email": "Curabitur@Sedpharetrafelis.ca"
      },
      {
        "password": "Hu",
        "email": "at.libero@placeratvelit.ca"
      },
      {
        "password": "Alika",
        "email": "tempor@dapibusquam.net"
      },
      {
        "password": "Lilah",
        "email": "auctor.velit@in.edu"
      },
      {
        "password": "Cynthia",
        "email": "eleifend.vitae@Etiamimperdiet.org"
      },
      {
        "password": "Zoe",
        "email": "sit@accumsan.co.uk"
      },
      {
        "password": "Wayne",
        "email": "aliquam@est.org"
      },
      {
        "password": "Britanney",
        "email": "velit.eu@blanditenim.org"
      },
      {
        "password": "Marny",
        "email": "Aliquam@Suspendissealiquetsem.org"
      },
      {
        "password": "Beau",
        "email": "liberewro@nec.com"
      },
      {
        "password": "Cullen",
        "email": "farewcilisis@nuncinterdum.com"
      },
      {
        "password": "Aphrodite",
        "email": "trrewistique@sedpede.org"
      },
      {
        "password": "Colorado",
        "email": "arewnte@ac.co.uk"
      },
      {
        "password": "Keiko",
        "email": "durewi@nonquam.ca"
      },
      {
        "password": "Nicole",
        "email": "iprewrsum.ac@ultricesVivamusrhoncus.net"
      },
      {
        "password": "Charlotte",
        "email": "rew.nisi@liberoIntegerin.com"
      },{
        "password": "Colorado",
        "email": "ante@ac.co.uk"
      },
      {
        "password": "Keiko",
        "email": "dfwui@nonquam.ca"
      },
      {
        "password": "Nicole",
        "email": "ipsumq.ac@ultricesVivamusrhoncus.net"
      },
      {
        "password": "Charlotte",
        "email": "vuleputate.nisi@liberoIntegerin.com"
      },{
        "password": "Colorado",
        "email": "antew@ac.co.uk"
      },
      {
        "password": "Keiko",
        "email": "deui@nonquam.ca"
      },
      {
        "password": "Nicole",
        "email": "ipfsum.ac@ultricesVivamusrhoncus.net"
      },
      {
        "password": "Charlotte",
        "email": "vulputat2e.nisi@liberoIntegerin.com"
      }];

    Db.Person.bulkCreate(PersonData).then(function (Persons) {
      var DetailsData = [
          {
            "type" : 'hamster',
            "name" : 'Rabotin',
            "firstname" : 'Arthur',
            "gender" : 'male',
            "age" : new Date(1238183104),
            "PersonId" : 1
          },
          {
            "type" : 'hamster',
            "name" : 'bahl',
            "firstname" : 'Trou2',
            "gender" : 'male',
            "age" : new Date(1238183104),
            "PersonId" : 2
          },
          {
            "type" : 'hamster',
            "name" : 'bahl',
            "firstname" : 'Trou2',
            "gender" : 'male',
            "age" : new Date(1238183104),
            "PersonId" : 3
          },
          {
            "type" : 'hamster',
            "name" : '34',
            "firstname" : 'Popol',
            "gender" : 'male',
            "age" : new Date(1238183104),
            "PersonId" : 4
          },
          {
            "type": "hamster",
            "name": "Keaton",
            "firstname": "Velma",
            "gender": "male",
            "age" : new Date(1238183104),
            "PersonId": 5
          },
          {
            "type": "hamster",
            "name": "Rae",
            "firstname": "Nina",
            "gender": "female",
            "age" : new Date(931397641),
            "PersonId": 6
          },
          {
            "type": "hamster",
            "name": "Rama",
            "firstname": "Finn",
            "gender": "female",
            "age" : new Date(951569323),
            "PersonId": 7
          },
          {
            "type": "hamster",
            "name": "Hermione",
            "firstname": "Chelsea",
            "gender": "female",
            "age" : new Date(1325215492),
            "PersonId": 8
          },
          {
            "type": "hamster",
            "name": "Juliet",
            "firstname": "Maya",
            "gender": "female",
            "age" : new Date(1128077462),
            "PersonId": 9
          },
          {
            "type": "hamster",
            "name": "Illana",
            "firstname": "Patience",
            "gender": "female",
            "age" : new Date(1463113282),
            "PersonId": 10
          },
          {
            "type": "hamster",
            "name": "Lilah",
            "firstname": "Quemby",
            "gender": "male",
            "age" : new Date(1144038324),
            "PersonId": 11
          },
          {
            "type": "hamster",
            "name": "Gemma",
            "firstname": "Harlan",
            "gender": "male",
            "age" : new Date(1112760666),
            "PersonId": 12
          },
          {
            "type": "hamster",
            "name": "Alan",
            "firstname": "Oliver",
            "gender": "male",
            "age" : new Date(1276879552),
            "PersonId": 13
          },
          {
            "type": "hamster",
            "name": "Jennifer",
            "firstname": "Mia",
            "gender": "female",
            "age" : new Date(1150214125),
            "PersonId": 14
          },
          {
            "type": "hamster",
            "name": "Dahlia",
            "firstname": "Clio",
            "gender": "male",
            "age" : new Date(840669700),
            "PersonId": 15
          },
          {
            "type": "hamster",
            "name": "Tallulah",
            "firstname": "Aurelia",
            "gender": "male",
            "age" : new Date(1210431906),
            "PersonId": 16
          },
          {
            "type": "hamster",
            "name": "Abel",
            "firstname": "Phillip",
            "gender": "female",
            "age" : new Date(1118065874),
            "PersonId": 17
          },
          {
            "type": "hamster",
            "name": "Ulric",
            "firstname": "Lev",
            "gender": "female",
            "age" : new Date(1347605951),
            "PersonId": 18
          },
          {
            "type": "hamster",
            "name": "Octavia",
            "firstname": "Bryar",
            "gender": "male",
            "age" : new Date(1437791088),
            "PersonId": 19
          },
          {
            "type": "hamster",
            "name": "Robert",
            "firstname": "Iona",
            "gender": "male",
            "age" : new Date(830990455),
            "PersonId": 20
          },
          {
            "type": "hamster",
            "name": "Louis",
            "firstname": "Hedy",
            "gender": "male",
            "age" : new Date(1402504064),
            "PersonId": 21
          },
          {
            "type": "hamster",
            "name": "Daquan",
            "firstname": "Ivor",
            "gender": "female",
            "age" : new Date(866020107),
            "PersonId": 22
          },
          {
            "type": "hamster",
            "name": "Alfonso",
            "firstname": "Keiko",
            "gender": "female",
            "age" : new Date(1140983316),
            "PersonId": 23
          },
          {
            "type": "hamster",
            "name": "Caleb",
            "firstname": "Hayden",
            "gender": "female",
            "age" : new Date(1148794476),
            "PersonId": 24
          },
          {
            "type": "hamster",
            "name": "Rebekah",
            "firstname": "Minerva",
            "gender": "male",
            "age" : new Date(1393543167),
            "PersonId": 25
          },
          {
            "type": "hamster",
            "name": "Dolan",
            "firstname": "Clark",
            "gender": "female",
            "age" : new Date(1063840047),
            "PersonId": 26
          },
          {
            "type": "hamster",
            "name": "Nadine",
            "firstname": "Kirk",
            "gender": "male",
            "age" : new Date(1445563903),
            "PersonId": 27
          },
          {
            "type": "hamster",
            "name": "Blaze",
            "firstname": "Noah",
            "gender": "male",
            "age" : new Date(1200228990),
            "PersonId": 28
          },
          {
            "type": "hamster",
            "name": "Teagan",
            "firstname": "Chadwick",
            "gender": "female",
            "age" : new Date(1294106090),
            "PersonId": 29
          },
          {
            "type": "hamster",
            "name": "Teagan",
            "firstname": "Chadwick",
            "gender": "female",
            "age" : new Date(1294106090),
            "PersonId": 30
          },
          {
            "type": "hamster",
            "name": "Teagan",
            "firstname": "Chadwick",
            "gender": "female",
            "age" : new Date(1294106090),
            "PersonId": 31
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

        var FriendsData = [
          {
            "PersonId": 1,
            "FriendId": 6,
            "confirmed": true
          },
          {
            "PersonId": 13,
            "FriendId": 15,
            "confirmed": true
          },
          {
            "PersonId": 8,
            "FriendId": 17,
            "confirmed": true
          },
          {
            "PersonId": 15,
            "FriendId": 13,
            "confirmed": true
          },
          {
            "PersonId": 10,
            "FriendId": 4,
            "confirmed": true
          },
          {
            "PersonId": 16,
            "FriendId": 15,
            "confirmed": false
          },
          {
            "PersonId": 1,
            "FriendId": 4,
            "confirmed": true
          },
          {
            "PersonId": 10,
            "FriendId": 16,
            "confirmed": false
          },
          {
            "PersonId": 8,
            "FriendId": 1,
            "confirmed": true
          },
          {
            "PersonId": 15,
            "FriendId": 1,
            "confirmed": false
          }
        ]

        Db.PeopleFriend.bulkCreate(FriendsData).then(function () {
          self.populateDevice();
          self.populateAvatar();
        })
        
      });
    }).catch(function (err) {
      console.log(err);
    })
  }
  return this;
})()

module.exports = FakeData;