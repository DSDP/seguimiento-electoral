/**
* Borough.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	town: {
  		model: 'town'
  	},

  	name: 'string',

  	schools: {
  		collection: 'school',
  		via: 'borough'
  	},
  }
};

