var Db = require('../application/models'),
    Utils = require('../application/hra/lib/utils').RandomUtils,
    Moment = require('moment');

var FakeData = (function () {
  var self = this;

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
        //self.populateStats(device.id);
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
        "email": "libero@nec.com"
      },
      {
        "password": "Cullen",
        "email": "facilisis@nuncinterdum.com"
      },
      {
        "password": "Aphrodite",
        "email": "tristique@sedpede.org"
      },
      {
        "password": "Colorado",
        "email": "ante@ac.co.uk"
      },
      {
        "password": "Keiko",
        "email": "dui@nonquam.ca"
      },
      {
        "password": "Nicole",
        "email": "ipsum.ac@ultricesVivamusrhoncus.net"
      },
      {
        "password": "Charlotte",
        "email": "vulputate.nisi@liberoIntegerin.com"
      }];

    Db.Person.bulkCreate(PersonData).then(function (Persons) {
      var DetailsData = [
          {
            "type" : 'hamster',
            "name" : 'Rabotin',
            "firstname" : 'Arthur',
            "gender" : 'male',
            "age" : new Date('1984-11-11'),
            "PersonId" : 1
          },
          {
            "type" : 'hamster',
            "name" : 'bahl',
            "firstname" : 'Trou2',
            "gender" : 'male',
            "age" : new Date('1984-11-11'),
            "PersonId" : 2
          },
          {
            "type" : 'hamster',
            "name" : 'bahl',
            "firstname" : 'Trou2',
            "gender" : 'male',
            "age" : new Date('1984-11-11'),
            "PersonId" : 3
          },
          {
            "type" : 'hamster',
            "name" : '34',
            "firstname" : 'Popol',
            "gender" : 'male',
            "age" : new Date('1984-11-11'),
            "PersonId" : 4
          },{
            "type": "hamster",
            "name": "Phasellus.elit@dignissim.ca",
            "firstname": "Kyla",
            "gender": "female",
            "age": new Date('2014-08-31'),
            "PersonId": 5
          },
          {
            "type": "hamster",
            "name": "cursus.a.enim@vulputaterisusa.ca",
            "firstname": "Virginia",
            "gender": "male",
            "age": new Date('2014-07-17'),
            "PersonId": 6
          },
          {
            "type": "hamster",
            "name": "elit@Donecsollicitudin.edu",
            "firstname": "Morgan",
            "gender": "male",
            "age": new Date('2015-08-14'),
            "PersonId": 7
          },
          {
            "type": "hamster",
            "name": "lorem.vitae@loremut.edu",
            "firstname": "Angelica",
            "gender": "female",
            "age": new Date('2015-12-31'),
            "PersonId": 8
          },
          {
            "type": "hamster",
            "name": "Fusce@sedlibero.co.uk",
            "firstname": "Paul",
            "gender": "male",
            "age": new Date('2015-08-01'),
            "PersonId": 9
          },
          {
            "type": "hamster",
            "name": "ac.feugiat@orci.com",
            "firstname": "Juliet",
            "gender": "female",
            "age": new Date('2014-10-30'),
            "PersonId": 10
          },
          {
            "type": "hamster",
            "name": "nec.cursus.a@faucibusorci.org",
            "firstname": "Raven",
            "gender": "female",
            "age": new Date('2016-02-17'),
            "PersonId": 11
          },
          {
            "type": "hamster",
            "name": "enim.Etiam.gravida@arcuimperdiet.net",
            "firstname": "Stella",
            "gender": "male",
            "age": new Date('2015-12-19'),
            "PersonId": 12
          },
          {
            "type": "hamster",
            "name": "sit@etrutrumeu.edu",
            "firstname": "Ifeoma",
            "gender": "male",
            "age": new Date('2015-05-01'),
            "PersonId": 13
          },
          {
            "type": "hamster",
            "name": "aliquet.vel@utaliquamiaculis.co.uk",
            "firstname": "Emmanuel",
            "gender": "female",
            "age": new Date('2015-07-13'),
            "PersonId": 14
          },
          {
            "type": "hamster",
            "name": "enim.sit@faucibus.co.uk",
            "firstname": "Hadley",
            "gender": "male",
            "age": new Date('2014-06-03'),
            "PersonId": 15
          },
          {
            "type": "hamster",
            "name": "lorem.ac@egestasDuisac.net",
            "firstname": "Naida",
            "gender": "female",
            "age": new Date('2015-05-01'),
            "PersonId": 16
          },
          {
            "type": "hamster",
            "name": "mus.Proin@anunc.net",
            "firstname": "Gwendolyn",
            "gender": "female",
            "age": new Date('2014-10-17'),
            "PersonId": 17
          },
          {
            "type": "hamster",
            "name": "neque.venenatis.lacus@ullamcorperviverra.com",
            "firstname": "Rana",
            "gender": "female",
            "age": new Date('2015-03-14'),
            "PersonId": 18
          },
          {
            "type": "hamster",
            "name": "Donec.est.mauris@auctorveliteget.net",
            "firstname": "Tatum",
            "gender": "female",
            "age": new Date('2015-01-06'),
            "PersonId": 19
          },
          {
            "type": "hamster",
            "name": "purus.Maecenas.libero@etliberoProin.edu",
            "firstname": "Summer",
            "gender": "male",
            "age": new Date('2015-08-16'),
            "PersonId": 20
          },
          {
            "type": "hamster",
            "name": "neque.Nullam@estNunc.net",
            "firstname": "Pearl",
            "gender": "male",
            "age": new Date('2014-10-29'),
            "PersonId": 21
          },
          {
            "type": "hamster",
            "name": "ad.litora.torquent@feugiatLorem.org",
            "firstname": "Hector",
            "gender": "male",
            "age": new Date('2014-07-01'),
            "PersonId": 22
          },
          {
            "type": "hamster",
            "name": "risus.Duis.a@magna.edu",
            "firstname": "Chloe",
            "gender": "male",
            "age": new Date('2015-07-02'),
            "PersonId": 23
          },
          {
            "type": "hamster",
            "name": "interdum@sit.co.uk",
            "firstname": "Zenaida",
            "gender": "female",
            "age": new Date('2016-01-10'),
            "PersonId": 24
          },
          {
            "type": "hamster",
            "name": "tincidunt.tempus.risus@loremluctusut.co.uk",
            "firstname": "Eugenia",
            "gender": "female",
            "age": new Date('2015-01-21'),
            "PersonId": 25
          },
          {
            "type": "hamster",
            "name": "porta@diam.edu",
            "firstname": "Chaim",
            "gender": "female",
            "age": new Date('2015-09-19'),
            "PersonId": 26
          },
          {
            "type": "hamster",
            "name": "et@odio.ca",
            "firstname": "Maxine",
            "gender": "female",
            "age": new Date('2015-03-21'),
            "PersonId": 27
          },
          {
            "type": "hamster",
            "name": "lacus@commodoat.ca",
            "firstname": "Leslie",
            "gender": "female",
            "age": new Date('2015-02-03'),
            "PersonId": 28
          },
          {
            "type": "hamster",
            "name": "sit.amet.diam@sedsapien.org",
            "firstname": "Alana",
            "gender": "male",
            "age": new Date('2014-08-10'),
            "PersonId": 29
          },
          {
            "type": "hamster",
            "name": "pede.Praesent@ipsum.co.uk",
            "firstname": "Francesca",
            "gender": "female",
            "age": new Date('2014-05-08'),
            "PersonId": 30
          },
          {
            "type": "hamster",
            "name": "dictum.sapien.Aenean@erat.org",
            "firstname": "Dakota",
            "gender": "female",
            "age": new Date('2015-04-16'),
            "PersonId": 31
          },
          {
            "type": "hamster",
            "name": "molestie.pharetra.nibh@ametmetusAliquam.org",
            "firstname": "Hyacinth",
            "gender": "female",
            "age": new Date('2014-08-28'),
            "PersonId": 32
          },
          {
            "type": "hamster",
            "name": "Quisque.porttitor@magnisdisparturient.edu",
            "firstname": "Jamalia",
            "gender": "male",
            "age": new Date('2015-03-31'),
            "PersonId": 33
          },
          {
            "type": "hamster",
            "name": "urna.Ut@scelerisqueduiSuspendisse.edu",
            "firstname": "Kirk",
            "gender": "male",
            "age": new Date('2016-01-09'),
            "PersonId": 34
          },
          {
            "type": "hamster",
            "name": "nulla@ultricessitamet.edu",
            "firstname": "Wesley",
            "gender": "male",
            "age": new Date('2015-12-05'),
            "PersonId": 35
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
            "PersonId": 30,
            "FriendId": 20,
            "confirmed": false
          },
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
            "PersonId": 35,
            "FriendId": 32,
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
            "FriendId": 11,
            "confirmed": false
          },
          {
            "PersonId": 1,
            "FriendId": 9,
            "confirmed": true
          },
          {
            "PersonId": 19,
            "FriendId": 19,
            "confirmed": true
          },
          {
            "PersonId": 5,
            "FriendId": 28,
            "confirmed": true
          },
          {
            "PersonId": 33,
            "FriendId": 27,
            "confirmed": true
          },
          {
            "PersonId": 24,
            "FriendId": 28,
            "confirmed": false
          },
          {
            "PersonId": 19,
            "FriendId": 31,
            "confirmed": true
          },
          {
            "PersonId": 20,
            "FriendId": 2,
            "confirmed": true
          },
          {
            "PersonId": 15,
            "FriendId": 3,
            "confirmed": true
          },
          {
            "PersonId": 10,
            "FriendId": 9,
            "confirmed": false
          },
          {
            "PersonId": 12,
            "FriendId": 31,
            "confirmed": true
          },
          {
            "PersonId": 23,
            "FriendId": 23,
            "confirmed": false
          },
          {
            "PersonId": 35,
            "FriendId": 13,
            "confirmed": true
          },
          {
            "PersonId": 8,
            "FriendId": 31,
            "confirmed": false
          },
          {
            "PersonId": 34,
            "FriendId": 1,
            "confirmed": true
          },
          {
            "PersonId": 4,
            "FriendId": 33,
            "confirmed": false
          },
          {
            "PersonId": 5,
            "FriendId": 1,
            "confirmed": true
          },
          {
            "PersonId": 15,
            "FriendId": 8,
            "confirmed": true
          },
          {
            "PersonId": 17,
            "FriendId": 19,
            "confirmed": false
          },
          {
            "PersonId": 12,
            "FriendId": 3,
            "confirmed": false
          },
          {
            "PersonId": 12,
            "FriendId": 2,
            "confirmed": true
          },
          {
            "PersonId": 20,
            "FriendId": 16,
            "confirmed": true
          },
          {
            "PersonId": 19,
            "FriendId": 22,
            "confirmed": false
          },
          {
            "PersonId": 10,
            "FriendId": 16,
            "confirmed": false
          },
          {
            "PersonId": 17,
            "FriendId": 9,
            "confirmed": true
          },
          {
            "PersonId": 31,
            "FriendId": 20,
            "confirmed": true
          },
          {
            "PersonId": 19,
            "FriendId": 27,
            "confirmed": true
          },
          {
            "PersonId": 11,
            "FriendId": 32,
            "confirmed": false
          },
          {
            "PersonId": 15,
            "FriendId": 9,
            "confirmed": true
          },
          {
            "PersonId": 12,
            "FriendId": 4,
            "confirmed": false
          },
          {
            "PersonId": 1,
            "FriendId": 33,
            "confirmed": true
          },
          {
            "PersonId": 7,
            "FriendId": 21,
            "confirmed": true
          },
          {
            "PersonId": 6,
            "FriendId": 35,
            "confirmed": true
          },
          {
            "PersonId": 25,
            "FriendId": 30,
            "confirmed": true
          },
          {
            "PersonId": 8,
            "FriendId": 11,
            "confirmed": false
          },
          {
            "PersonId": 9,
            "FriendId": 25,
            "confirmed": false
          },
          {
            "PersonId": 30,
            "FriendId": 4,
            "confirmed": true
          },
          {
            "PersonId": 2,
            "FriendId": 33,
            "confirmed": false
          },
          {
            "PersonId": 9,
            "FriendId": 5,
            "confirmed": true
          },
          {
            "PersonId": 15,
            "FriendId": 20,
            "confirmed": true
          },
          {
            "PersonId": 10,
            "FriendId": 28,
            "confirmed": false
          },
          {
            "PersonId": 35,
            "FriendId": 23,
            "confirmed": true
          },
          {
            "PersonId": 4,
            "FriendId": 14,
            "confirmed": true
          },
          {
            "PersonId": 29,
            "FriendId": 31,
            "confirmed": false
          },
          {
            "PersonId": 33,
            "FriendId": 26,
            "confirmed": true
          },
          {
            "PersonId": 33,
            "FriendId": 2,
            "confirmed": true
          },
          {
            "PersonId": 19,
            "FriendId": 24,
            "confirmed": true
          },
          {
            "PersonId": 23,
            "FriendId": 30,
            "confirmed": true
          },
          {
            "PersonId": 12,
            "FriendId": 27,
            "confirmed": false
          },
          {
            "PersonId": 6,
            "FriendId": 21,
            "confirmed": true
          },
          {
            "PersonId": 1,
            "FriendId": 18,
            "confirmed": false
          },
          {
            "PersonId": 16,
            "FriendId": 20,
            "confirmed": false
          },
          {
            "PersonId": 13,
            "FriendId": 25,
            "confirmed": true
          },
          {
            "PersonId": 10,
            "FriendId": 11,
            "confirmed": false
          },
          {
            "PersonId": 14,
            "FriendId": 8,
            "confirmed": false
          },
          {
            "PersonId": 6,
            "FriendId": 11,
            "confirmed": false
          },
          {
            "PersonId": 25,
            "FriendId": 25,
            "confirmed": false
          },
          {
            "PersonId": 6,
            "FriendId": 23,
            "confirmed": false
          },
          {
            "PersonId": 8,
            "FriendId": 19,
            "confirmed": true
          },
          {
            "PersonId": 5,
            "FriendId": 15,
            "confirmed": true
          },
          {
            "PersonId": 31,
            "FriendId": 15,
            "confirmed": true
          },
          {
            "PersonId": 7,
            "FriendId": 18,
            "confirmed": true
          },
          {
            "PersonId": 18,
            "FriendId": 22,
            "confirmed": true
          },
          {
            "PersonId": 34,
            "FriendId": 18,
            "confirmed": false
          },
          {
            "PersonId": 14,
            "FriendId": 21,
            "confirmed": false
          },
          {
            "PersonId": 16,
            "FriendId": 5,
            "confirmed": false
          },
          {
            "PersonId": 17,
            "FriendId": 13,
            "confirmed": false
          },
          {
            "PersonId": 22,
            "FriendId": 25,
            "confirmed": false
          },
          {
            "PersonId": 11,
            "FriendId": 8,
            "confirmed": false
          },
          {
            "PersonId": 33,
            "FriendId": 9,
            "confirmed": false
          },
          {
            "PersonId": 6,
            "FriendId": 14,
            "confirmed": true
          },
          {
            "PersonId": 29,
            "FriendId": 15,
            "confirmed": true
          },
          {
            "PersonId": 19,
            "FriendId": 33,
            "confirmed": false
          },
          {
            "PersonId": 14,
            "FriendId": 5,
            "confirmed": true
          },
          {
            "PersonId": 12,
            "FriendId": 22,
            "confirmed": false
          },
          {
            "PersonId": 29,
            "FriendId": 3,
            "confirmed": false
          },
          {
            "PersonId": 26,
            "FriendId": 27,
            "confirmed": false
          },
          {
            "PersonId": 18,
            "FriendId": 19,
            "confirmed": true
          },
          {
            "PersonId": 12,
            "FriendId": 33,
            "confirmed": true
          },
          {
            "PersonId": 27,
            "FriendId": 32,
            "confirmed": true
          },
          {
            "PersonId": 31,
            "FriendId": 18,
            "confirmed": true
          },
          {
            "PersonId": 10,
            "FriendId": 25,
            "confirmed": false
          },
          {
            "PersonId": 29,
            "FriendId": 12,
            "confirmed": true
          },
          {
            "PersonId": 26,
            "FriendId": 13,
            "confirmed": false
          },
          {
            "PersonId": 23,
            "FriendId": 9,
            "confirmed": true
          },
          {
            "PersonId": 12,
            "FriendId": 35,
            "confirmed": false
          },
          {
            "PersonId": 28,
            "FriendId": 1,
            "confirmed": true
          },
          {
            "PersonId": 28,
            "FriendId": 15,
            "confirmed": true
          },
          {
            "PersonId": 22,
            "FriendId": 23,
            "confirmed": true
          }
        ]

        Db.PeopleFriend.bulkCreate(FriendsData)

        
        // populate device
        for (var i = 1; i < 10; ++i) {
          (function () {
            Db.Device.create({
              apiKey: 4242,
              userKey: 'azerty',
              privateKey: 'keyboardcat'
            }).then(function (device) {
              // then attach device to Person
              Db.RegisteredDevice.create({
                hash: 'thisisafakehashfortesting',
                PersonId: i,
                DeviceId: device.id
              })
              
              self.populateStats(device.id);
            })
          })()
        }


        
      });
    }).catch(function (err) {
      console.log(err);
    })
  }
  return this;
})()

module.exports = FakeData;