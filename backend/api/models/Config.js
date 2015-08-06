/**
* Config.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrage: 'alter',
  
  attributes: {
    name: 'string',
    
  	type: 'string',

  	teams: {
  		collection: 'team',
      via: 'configs'
  	},

  	country: {
  		model: 'country',
  	},

  	province: {
  		model: 'province'
  	},

  	town: {
  		model: 'town'
  	},

  	charge: {
  		model: 'charge'
  	},

  	candidates: {
  		collection: 'candidate'
  	},
    instances: {
      collection: 'instance'
    },    

    isVersus: 'boolean',
  }
};

