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
		var query = Config.findOne( req.query.config ).populate('candidates');

	  	query.exec( function found( err, matchingRecord ) {
			var candivotes = [];

			Board.findOne(req.query.board).populate('school').exec(function (err, board) {
				Borough.findOne(board.school.borough).exec(function (err, borough) {
					_.each(matchingRecord.candidates, function (candidate) {
				 		var p = {
				 			school: board.school.id,
				 			borough: borough.id,
				 			candidate: candidate.id,
				 			instance: req.query.instance,
				 			board: req.query.board,
				 			config: req.query.config
				 		};
				 		candivotes.push(p);
				 	});
				 	Candivote.findOrCreate(candivotes).exec(function (err, results) {
						if (!results) {
							results = [];
						}
						res.ok({candivotes: results});
				 	});
				});
			});
	  	});
	}
};

