var Db = require('../application/models');

var FakeData = (function () {

  this.populate = function () {
    // populate person
    var p1 = Db.Person.create({
      email : 'toto@toto.com',
      password : 'toto1'
    }).then(function (Person) {
      Db.PersonDetails.create({
        type : 'hamster',
        name : 'Rabotin',
        firstname : 'Arthur',
        gender : 'male',
        age : new Date('1984-11-11'),
        PersonId: Person.id
      })
      Db.Post.create({
        content : {text: "J'ai couru 34 km hier ! Un vrai record, mais je suis mort ! LOL !"},
        PersonId: Person.id
      })
      Db.Post.create({
        content : {text: "Je roxx trop du poney !"},
        PersonId: Person.id
      })
    }).catch(function (err) {
      console.log(err)
    })

    var p2 = Db.Person.create({
      email : 'toti@toto.com',
      password : 'toto2'
    }).then(function (Person) {
      Db.PersonDetails.create({
        type : 'hamster',
        name : 'bahl',
        firstname : 'Trou2',
        gender : 'male',
        age : new Date('1984-11-11'),
        PersonId: Person.id
      })
    }).catch(function (err) {
      console.log(err)
    })

    var p3 = Db.Person.create({
      email : 'tato@toto.com',
      password : 'toto3'
    }).then(function (Person) {
      Db.PersonDetails.create({
        type : 'hamster',
        name : '34',
        firstname : 'Popol',
        gender : 'male',
        age : new Date('1984-11-11'),
        PersonId: Person.id
      })
      Db.Post.create({
        content: {text : "Hey mate cette video, ca dechire !", video : "http://img-9gag-ftw.9cache.com/photo/aGV3m17_460sv.mp4"},
        PersonId: Person.id
      }).then(function (post) {
        Db.Comment.create({
          content: {text: "Effectivement, trop marrant quand il encule le chaton mort !"},
          PersonId: Person.id,
          PostId: post.id
        })
      })
    }).catch(function (err) {
      console.log(err)
    })


    var p4 = Db.Person.create({
      email : 'tata@toto.com',
      password : 'toto4'
    }).then(function (Person) {
      Db.PersonDetails.create({
        type : 'hamster',
        name : '72',
        firstname : 'Roxxor',
        gender : 'male',
        age : new Date('1984-11-11'),
        PersonId: Person.id
      })

      // populate friend
      Db.PeopleFriend.create({
        PersonId: 4,
        FriendId: 3,
        confirmed: true
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

    }).catch(function (err) {
      console.log(err)
    })

    // populate device
    Db.Device.create({
      apiKey: 4242,
      userKey: 'azerty',
      privateKey: 'keyboardcat'
    })

    Db.RegisteredPerson.create({
      token: 'thisisafaketokenfortesting',
      email: p1.email
    }).then(function (rp1) {
      Db.RegisteredDevice.create({
        hash: 'thisisafakehashfortesting',
        PersonId: 1,
        RegisteredPersonId: rp1.id
      })
    })

    // populate events

  }
  return this;
})()

module.exports = FakeData;