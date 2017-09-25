/**
* Board.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrate: 'drop',

  attributes: {
  	name: 'string',
  	totalVotes: 'string',
  	blankVotes: 'string',
  	recurredVotes: 'string',
  	inpugnedVotes: 'string',
  	nullVotes: 'string',

    town: {
      model: 'town',
    }

    isCertificate: 'boolean',
  	isProvisorio: 'boolean',
  	school: {
  		model: 'school'
  	}
  }
};