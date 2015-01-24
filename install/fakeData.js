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
        content : {text : "Hey mate cette video, ca dechire !", video : "http://img-9gag-ftw.9cache.com/photo/aGV3m17_460sv.mp4"},
        PersonId: Person.id
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
    }).catch(function (err) {
      console.log(err)
    })

    Db.PeopleFriend.create({
      PersonId: p4.id,
      FriendId: p3.id,
      confirmed: true
    })

    Db.PeopleFriend.create({
      PersonId: p1.id,
      FriendId: p3.id,
      confirmed: true
    })

    Db.PeopleFriend.create({
      PersonId: p4.id,
      FriendId: p2.id,
      confirmed: true
    })
    
    Db.PeopleFriend.create({
      PersonId: p2.id,
      FriendId: p3.id,
      confirmed: true
    })
  }
  return this;
})()

module.exports = FakeData;