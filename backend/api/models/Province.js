/**
* Province.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrate: 'drop',
  attributes: {

  	name: 'string',

  	country: {
  		model: 'country'
  	},
  	
  }
};

