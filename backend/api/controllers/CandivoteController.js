/**
 * CandivoteController
 *
 * @description :: Server-side logic for managing candivotes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Q = require('q');
var util = require( 'util' ),
  actionUtil = require( '../blueprints/_util/actionUtil' );


module.exports = {
	find:  function findRecords( req, res ) {
		//var query = 'SELECT candivote.id, c.id as candidate, candivote.votes, candivote.board, candivote.borough, candivote.instance, candivote.school, candivote.config FROM candivote  LEFT JOIN candidate c ON candivote.candidate = c.id WHERE c.id > 0 AND candivote.config = ' + parseInt(req.query.config) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND candivote.board = ' + parseInt(req.query.board) + ' ORDER BY CAST(c.order AS SIGNED);';

		var query = Config.findOne( req.query.config ).populate('candidates');

	  	query.exec( function found( err, matchingRecord ) {
			var candivotes = [];

			Board.findOne(req.query.board).populate('school').exec(function (err, board) {
				console.log(board.school.borough);

				Borough.findOne(board.school.borough).exec(function (err, borough) {
					_.each(matchingRecord.candidates, function (candidate) {
				 		var p = {
				 			school: board.school.id,
				 			borough: borough.id,
				 			candidate: candidate.id,
				 			instance: req.query.instance,
				 			board: req.query.board,
				 			config: req.query.config,
				 			order: parseInt(candidate.order)
				 		};
				 		candivotes.push(p);
				 	});

				 	Candivote.findOrCreate(candivotes).exec(function (err, results) {
						if (!results) {
							results = [];
						}
						
						results.sort(function (a, b) {
						  if (a.order > b.order) {
						    return 1;
						  }
						  if (a.order < b.order) {
						    return -1;
						  }
						  // a must be equal to b
						  return 0;
						});
						res.ok({candivotes: results});
				 	});
				});
			});
	  	});
	}
};

