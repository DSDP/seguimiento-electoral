/**
* Board.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	name: 'string',
  	totalVotes: 'string',
  	blankVotes: 'string',
  	recurredVotes: 'string',
  	inpugnedVotes: 'string',
  	nullVotes: 'string',


    isCertificate: 'boolean',
  	isProvisorio: 'boolean',
  	school: {
  		model: 'school'
  	}
  }
};