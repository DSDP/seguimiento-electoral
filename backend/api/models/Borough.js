/**
* Borough.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrate: 'drop',

  autoPK:false,

  attributes: {
    id: {
      type:"string", 
      required:true, 
      unique: true,
      primaryKey: true
    },  	

    town: {
  		model: 'town'
  	},

    section: {
      model: 'section'
    },
    
  	name: 'string'
  }
};

