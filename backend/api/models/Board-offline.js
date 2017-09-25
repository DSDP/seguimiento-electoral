/**
 * Board-offline.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
    
  	config: {
  		model: 'config'
  	},

  	votes: 'json'
  },

  afterCreate: function (args, next) {
    var self = this;
    console.log(args);
    Board.findOne({name: args.number, town: args.town}).populate('school').exec(function (err, board) {
        console.log(board);
        next();
    });    
  },  
};

