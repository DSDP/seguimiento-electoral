/**
* Candivote.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    school: 'string',

    borough: 'string',

    board: 'string',
    
  	boardOffline: 'string',

  	config: 'string',

    instance: 'string',

  	candidate: 'string',

  	votes: {
      type : "string",
      defaultsTo : '0'
    }
  	
  }
};

