/**
* School.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrate: 'drop',
  attributes: {
  	name: 'string',
  	address: 'string',
    startBoard: 'integer',
    endBoard: 'integer',
  	
  	province: {
  		model: 'province'
  	},

    section: {
      model: 'section'
    },

  	town: {
  		model: 'town'
  	},

  	borough: {
  		model: 'borough'
  	},

  }
};

