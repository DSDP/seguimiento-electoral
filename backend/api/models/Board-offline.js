/**
 * Board-offline.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Q = require('q');
var json2csv = require('json2csv');

var util = require( 'util' ),
  actionUtil = require( '../blueprints/_util/actionUtil' );

module.exports = {
  migrate: 'drop',
  
  attributes: {
  	number: 'string',
  	totalVotes: 'string',
  	blankVotes: 'string',
  	recurredVotes: 'string',
  	inpugnedVotes: 'string',
  	nullVotes: 'string',

  	town: {
  		model: 'town'
  	},

    instance: {
      model: 'instance'
    },
    
  	config: {
  		model: 'config'
  	},

  	votes: 'json'
  },

  afterCreate: function (args, next) {
    var self = this;
    Board.findOne({name: args.number, town: args.town}).populate('school').exec(function (err, board) {
        console.log(board);
        var votes = JSON.parse(args.votes);
        var candivotes = [];

        _.each(votes, function (candidate) {
          var p = {
            school: board.school.id,
            borough: board.borough,
            candidate: candidate.id,
            instance: args.instance,
            board: board,
            config: args.config
          };
          candivotes.push(p);
        });

        
        console.log(candivotes);

        next();
    });    
  },  
};

