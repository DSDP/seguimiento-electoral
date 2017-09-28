var forEach       = require('lodash/collection/forEach');

module.exports = {

  subscribePoliticalData: function (req, res, next) {
    var ids, data = req.allParams(), model, subscribed = {};
    var result = {}; 

    //User.subscribe(req, data['user']);

    User.findOne({id: data['user']}).populate('teams').exec(function (err, user) {
      console.log(user.teams);
      forEach(user.teams, function (team) {
        forEach(team.configs, function (config) { 
           Config.subscribe(req, config);
        });
      })
    });

    //Board.find().exec(function (err, records) {
     // if (err) {
    //    result = {error: 'No se pudo subscribir a ' + model};
    //    res.json(result);
    //  }
    //  forEach( records, function ( record ) {
    //    Board.subscribe(req, record.id);
    //  } );      
//    });

    /** config.find().exec(function (err, records) {
      if (err) {
        result = {error: 'No se pudo subscribir a ' + model};
        res.json(result);
      }
      forEach( records, function ( record ) {
        Config.subscribe(req, record.id);
      } );      
    });


    Team.find().exec(function (err, records) {
      if (err) {
        result = {error: 'No se pudo subscribir a ' + model};
        res.json(result);
      }
      forEach( records, function ( record ) {
        Team.subscribe(req, record.id);
      } );      
    }); **/        
    result = {success: true};
    res.json(result);    
  }
};