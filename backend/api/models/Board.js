/**
* Board.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	migrate: 'alter',
  	name: 'string',
  	totalVotes: 'string',
  	isCertificate: 'boolean',
  	school: {
  		model: 'school'
  	}
  }
};