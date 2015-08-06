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
	/**
	Deprecated
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
				console.log('AAA ' + candivotesTotal.length);
				_.each(candivotesTotal, function (candivoteTotal) {
					if (parseInt(candivoteTotal.votes)) {
			   			total += parseInt(candivoteTotal.votes);	
					}
			   	});			

				where.candidate = req.body.candidate;

				Candivote.find(where).exec(function (err, candidateVotes) { 
					var current = 0;
					console.log('BBB ' + candidateVotes.length);
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
	},
	**/

	configPartialsOptimize: function (req, res) { 
  		var Model = actionUtil.parseModel( req );
		var pk = req.query.id;

		var query = Config.findOne( pk ).populate('candidates');
		query.exec( function found( err, matchingRecord ) {
			if ( err ) return res.serverError( err );
			if ( !matchingRecord ) return res.notFound( 'No record found with the specified `id`.' );

			if ( sails.hooks.pubsub && req.isSocket ) {
			  Model.subscribe( req, matchingRecord );
			  actionUtil.subscribeDeep( req, matchingRecord );
			}

			if (matchingRecord) {
				var query = 'SELECT candivote.id, f.id as `force`, c.id as candidate, sum(candivote.votes) as votes, sum(b.totalVotes) as totalVotes, br.id as borough FROM candivote RIGHT JOIN board b ON candivote.board = b.id LEFT JOIN borough br ON candivote.borough = br.id LEFT JOIN candidate c ON candivote.candidate = c.id LEFT JOIN `force` f ON c.force = f.id where candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' GROUP BY c.id, br.id;';

				var boardsQuery = 'SELECT candivote.id, b.id as board, c.id as candidate, candivote.votes, b.totalVotes, br.id as borough, b.updatedAt FROM candivote RIGHT JOIN board b ON candivote.board = b.id  LEFT JOIN borough br ON candivote.borough = br.id LEFT JOIN candidate c ON candivote.candidate = c.id  WHERE candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND b.totalVotes > 0 ORDER BY b.updatedAt DESC LIMIT ' + matchingRecord.candidates.length * 11 + ';';
				console.log(req.query.isBoards);
				if (req.query.isBoards == true) {
					query = boardsQuery;
				}

				Candivote.query(query, function (err, results) { 
					var totalBoardsQuery = 'SELECT count(b.id) FROM candivote RIGHT JOIN board b ON candivote.board = b.id WHERE candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' GROUP BY candivote.board;'
					var completedBoardsQuery = 'SELECT count(b.id) FROM candivote RIGHT JOIN board b ON candivote.board = b.id WHERE candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND b.totalVotes > 0 GROUP BY candivote.board;'
					Candivote.query(totalBoardsQuery, function (err, totalBoards) { 
						Candivote.query(completedBoardsQuery, function (err, completedBoards) { 
							res.ok({results: results, meta: {completed: completedBoards.length, total: totalBoards.length}});
						});
					});
				});
			}	
		});
	},
 /** deprecated
	configPartials: function (req, res)	{
	  var Model = actionUtil.parseModel( req );
	  var pk = req.query.id;

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
			where.instance = req.query.instance;

			var result = {
				candidates: []
			};
			
			Candivote.find(where).populate('board').exec(function (err, candivotesTotal) {
				var total = 0;
				var validBoards = [];
				var totalBoards = [];
				var id = 1;
				_.each(candivotesTotal, function (candivoteTotal) {
					var candidate = _.find(result.candidates, function(candidate){ return candidate.candidate  == candivoteTotal.candidate && candidate.borough == candivoteTotal.borough; });
					if (!candidate) {
						candidate = {id: id, candidate: candivoteTotal.candidate, totalVotes: 0, votes: 0, borough: candivoteTotal.borough }
						result.candidates.push(candidate);
						id++;
					}

					var board = _.find(totalBoards, function(board){ return board  == candivoteTotal.board.id});
					if (!board) {
						board = candivoteTotal.board.id
						totalBoards.push(board);
					}

					if (parseInt(candivoteTotal.board.totalVotes)) {
						var board = _.find(validBoards, function(board){ return board  == candivoteTotal.board.id});
						if (!board) {
							board = candivoteTotal.board.id
							validBoards.push(board);
						}					
						candidate.totalVotes += parseInt(candivoteTotal.board.totalVotes);
						if (parseInt(candivoteTotal.votes)) {
							candidate.votes += parseInt(candivoteTotal.votes);
						}
					}
			   	});	
				res.ok({results: result.candidates, meta: {completed: validBoards.length, total: totalBoards.length, date: new Date()}});
			});
		}
	  });		
	},
	*/
};

