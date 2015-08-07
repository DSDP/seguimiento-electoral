/**
* Candidate.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	migrate: 'alter',
	
	attributes: {
		name: 'string',
		lastName: 'string',
		alias: 'string',
		history: 'string',
		order: 'string',
		
		force: {
			model: 'force'
		},

		subforce: {
			model: 'subforce'
		},

		charge: {
			model: 'charge'
		},

		picture: {
		  model: 'asset',
		}, 
	}
};

