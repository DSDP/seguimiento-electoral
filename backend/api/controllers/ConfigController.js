/**
 * ConfigController
 *
 * @description :: Server-side logic for managing configs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 * Module dependencies
 */

var Q = require('q');
var util = require( 'util' ),
  actionUtil = require( '../blueprints/_util/actionUtil' );

/**
 * Enable sideloading. Edit config/blueprints.js and add:
 *   ember: {
 *     sideload: true
 *   }
 * Defaults to false.
 *
 * @type {Boolean}
 */
var performSideload = (sails.config.blueprints.ember && sails.config.blueprints.ember.sideload);

module.exports = {
	generateIFnoExist: function ( req, res ) {
	  var Model = actionUtil.parseModel( req );
	  var pk = req.params[0];

	  var query = Config.findOne( pk ).populate('candidates').populate('instances').populate('town').populate('province');
	  query.exec( function found( err, matchingRecord ) {
	    if ( err ) return res.serverError( err );
	    if ( !matchingRecord ) return res.notFound( 'No record found with the specified `id`.' );

	    if ( sails.hooks.pubsub && req.isSocket ) {
	      Model.subscribe( req, matchingRecord );
	      actionUtil.subscribeDeep( req, matchingRecord );
	    }

	    if (matchingRecord) {
	    	if (matchingRecord.type === 'Nacional') {
	    		Province.find().where({country: matchingRecord.country.id}).exec(function (err, provinces) {
	    			var pIds = [];
	    			_.each(provinces, function (province) {
	    				pIds.push(province.id);
	    			});	    			
		    		Town.find().where({province: pIds}).exec(function (err, towns) {
		    			var tIds = [];
		    			_.each(towns, function (town) {
		    				tIds.push(town.id);
		    			});
			    		School.find().where({town: tIds }).populate('boards').exec( function (err, schools) { 
			    			var boards = [];
			    			var candivotes = [];
			   			 	_.each( schools, function ( school ) {
			   			 		_.each( school.boards, function ( board ) {
			   			 			board.school = school;
			     		  			boards.push(board);
			     		  		});
			    		 	 } );

			   			 	_.each(matchingRecord.instances, function (instance) {
			   			 		_.each(matchingRecord.candidates, function (candidate) {
					   			 	_.each(boards, function (board) {
					   			 		var p = {
					   			 			school: board.school.id,
					   			 			candidate: candidate.id,
					   			 			instance: instance.id,
					   			 			board: board.id,
					   			 			config: matchingRecord.id
					   			 		};
					   			 		candivotes.push(p);
					   			 	});
			   			 		});
			   			 	});
			   			 	Candivote.findOrCreate(candivotes).exec(function () {
			    				res.ok( actionUtil.emberizeJSON( Config, matchingRecord, req.options.associations, performSideload ) );
			   			 	});
			    		});
		    		})
	    		});
	    	}

	    	if (matchingRecord.type === 'Provincial') {
	    		Town.find().where({province: matchingRecord.province.id}).exec(function (err, towns) {
	    			var tIds = [];
	    			_.each(towns, function (town) {
	    				tIds.push(town.id);
	    			});
		    		School.find().where({town: tIds }).populate('boards').exec( function (err, schools) { 
		    			var boards = [];
		    			var candivotes = [];
		   			 	_.each( schools, function ( school ) {
		   			 		_.each( school.boards, function ( board ) {
		   			 			board.school = school;
		     		  			boards.push(board);
		     		  		});
		    		 	 } );

		   			 	_.each(matchingRecord.instances, function (instance) {
		   			 		_.each(matchingRecord.candidates, function (candidate) {
				   			 	_.each(boards, function (board) {
				   			 		var p = {
				   			 			school: board.school.id,
				   			 			candidate: candidate.id,
				   			 			instance: instance.id,
				   			 			board: board.id,
				   			 			config: matchingRecord.id
				   			 		};
				   			 		candivotes.push(p);
				   			 	});
		   			 		});
		   			 	});
		   			 	Candivote.findOrCreate(candivotes).exec(function () {
		    				res.ok( actionUtil.emberizeJSON( Config, matchingRecord, req.options.associations, performSideload ) );
		   			 	});
		    		});
	    		})
	    	}

	    	if (matchingRecord.type === 'Districtal') {
	    		School.find().where({town: matchingRecord.town.id }).populate('boards').exec( function (err, schools) { 
	    			var boards = [];
	    			var candivotes = [];
	   			 	_.each( schools, function ( school ) {
	   			 		_.each( school.boards, function ( board ) {
	   			 			board.school = school;
	     		  			boards.push(board);
	     		  		});
	    		 	 } );

	   			 	_.each(matchingRecord.instances, function (instance) {
	   			 		_.each(matchingRecord.candidates, function (candidate) {
			   			 	_.each(boards, function (board) {
			   			 		var p = {
			   			 			school: board.school.id,
			   			 			candidate: candidate.id,
			   			 			instance: instance.id,
			   			 			board: board.id,
			   			 			config: matchingRecord.id
			   			 		};
			   			 		candivotes.push(p);
			   			 	});
	   			 		});
	   			 	});
	   			 	Candivote.findOrCreate(candivotes).exec(function () {
	    				res.ok( actionUtil.emberizeJSON( Config, matchingRecord, req.options.associations, performSideload ) );
	   			 	});
	    		});
	    	}
	    }
	  } );

	}
};

