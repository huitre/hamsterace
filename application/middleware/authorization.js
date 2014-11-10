
var Person = require('../model/person');

exports.isAuthenticated = function (req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.status(500).send({message: 'user.not.authorized'});
  }
}

exports.userExist = function(req, res, next) {
  Person.count([req.body.email], function (err, row) {
    if (row.length === 0) {
      next();
    } else {
      res.status(500).send({message: 'user.not.authorized', url : '/'});
    }
  });
}