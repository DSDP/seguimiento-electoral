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
			    		School.find().where({town: tIds }).populate('boards').populate('borough').exec( function (err, schools) { 
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
					   			 			borough: board.school.borough.id,
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
		    		School.find().where({town: tIds }).populate('boards').populate('borough').exec( function (err, schools) { 
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
				   			 			borough: board.school.borough.id,
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

	    	if (matchingRecord.type === 'Distrital') {
	    		School.find().where({town: matchingRecord.town.id }).populate('boards').populate('borough').exec( function (err, schools) { 
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
			   			 			borough: board.school.borough.id,
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

	},

	total: function ( req, res ) {
	  var Model = actionUtil.parseModel( req );
	  var pk = req.params[0];

	  var query = Config.findOne( pk );
	  query.exec( function found( err, matchingRecord ) {
		if ( err ) return res.serverError( err );
		if ( !matchingRecord ) return res.notFound( 'No record found with the specified `id`.' );

		if ( sails.hooks.pubsub && req.isSocket ) {
		  Model.subscribe( req, matchingRecord );
		  actionUtil.subscribeDeep( req, matchingRecord );
		}

		if (matchingRecord) {
			var where = {};
			where.config = pk;
			where.instance = req.body.instance;
			
			Candivote.find(where).exec(function (err, candivotesTotal) {
				var total = 0;

				_.each(candivotesTotal, function (candivoteTotal) {
					if (parseInt(candivoteTotal.votes)) {
			   			total += parseInt(candivoteTotal.votes);	
					}
			   	});			

				where.candidate = req.body.candidate;
				Candivote.find(where).exec(function (err, candidateVotes) { 
					var current = 0;

					_.each(candidateVotes, function (candivoteTotal) {
						if (parseInt(candivoteTotal.votes)) {
				   			current += parseInt(candivoteTotal.votes);
						}
				   	});		

					res.ok({total: current, percent: (current / total * 100).toFixed(2)});
				});
			});
		}
	  });
	}	
};

