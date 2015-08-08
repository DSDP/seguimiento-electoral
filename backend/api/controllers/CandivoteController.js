/**
 * CandivoteController
 *
 * @description :: Server-side logic for managing candivotes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:  function findRecords( req, res ) {
		var query = 'SELECT candivote.id, c.id as candidate, candivote.votes, candivote.board, candivote.borough, candivote.instance, candivote.school, candivote.config FROM candivote  LEFT JOIN candidate c ON candivote.candidate = c.id WHERE c.id > 0 AND candivote.config = ' + parseInt(req.query.instance) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND candidate.board = ' + parseInt(req.query.board) + ' ORDER BY CAST(c.order AS SIGNED);';

		Candivote.query(query, function (err, results) { 
			if (!results) {
				results = [];
			}
			res.ok({candivotes: results});
		});
	}
};

