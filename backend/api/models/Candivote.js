/**
* Candivote.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    school: {
      model: 'school',
    },

  	board: {
  		model: 'board'
  	},

  	config: {
  		model: 'config'
  	},

    instance: {
      model: 'instance'
    },

  	candidate: {
  		model: 'candidate',
  	},

  	votes: 'string'
  }
};

