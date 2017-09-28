var forEach       = require('lodash/collection/forEach');

module.exports = {

  subscribePoliticalData: function (req, res, next) {
    var ids, data = req.allParams(), model, subscribed = {};
    var result = {}; 

    User.findOne({id: data['user']}).populate('teams').exec(function (err, user) {
      var tids = [];
      forEach(user.teams, function (team) {
        tids.push(team.id);
      })

      Team.find(tids).populate('configs').exec(function (err, teams) {
        forEach(teams, function (team) {
          forEach(team.configs, function (config) {
            Config.subscribe(req, config.id);
          })
        })
      })
    });

    result = {success: true};
    res.json(result);    
  }
};