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
var json2csv = require('json2csv');

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

				var candidates = [];
   			 	_.each( matchingRecord.candidates, function ( candidate ) {
   			 		candidates.push(candidate.id);
    		 	} );

				var query = 'SELECT c.order, candivote.id, f.id as `force`, c.id as candidate, sum(candivote.votes) as votes, sum(b.totalVotes) as totalVotes, br.id as borough FROM candivote RIGHT JOIN board b ON candivote.board = b.id LEFT JOIN borough br ON candivote.borough = br.id LEFT JOIN candidate c ON candivote.candidate = c.id LEFT JOIN `force` f ON c.force = f.id where candivote.candidate in (' + candidates.join(',') + ') AND c.id > 0 AND candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' GROUP BY c.id, br.id order by CAST(c.order AS SIGNED);';
				var boardsQuery = 'SELECT candivote.id, b.id as board, c.id as candidate, candivote.votes, b.totalVotes, br.id as borough, b.updatedAt FROM candivote RIGHT JOIN board b ON candivote.board = b.id  LEFT JOIN borough br ON candivote.borough = br.id LEFT JOIN candidate c ON candivote.candidate = c.id  WHERE candivote.candidate in (' + candidates.join(',') + ') AND candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND b.isProvisorio > 0 ORDER BY b.updatedAt DESC, CAST(c.order AS SIGNED) LIMIT ' + matchingRecord.candidates.length * 50 + ';';
				var boardsCertificateQuery = 'SELECT candivote.id, b.id as board, c.id as candidate, candivote.votes, b.totalVotes, br.id as borough, b.updatedAt FROM candivote RIGHT JOIN board b ON candivote.board = b.id  LEFT JOIN borough br ON candivote.borough = br.id LEFT JOIN candidate c ON candivote.candidate = c.id  WHERE candivote.candidate in (' + candidates.join(',') + ') AND candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND b.isCertificate > 0 ORDER BY b.updatedAt DESC, CAST(c.order AS SIGNED) LIMIT ' + matchingRecord.candidates.length * 50 + ';';
				if (req.query.isBoards) {
					if (req.query.isCertificate == "true") {
						query = boardsCertificateQuery;
					} else {
						query = boardsQuery;
					}
				}

				Candivote.query(query, function (err, results) {
					//var totalBoardsQuery = 'SELECT count(b.id) FROM candivote RIGHT JOIN board b ON candivote.board = b.id WHERE candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' GROUP BY candivote.board;';
					var totalBoardsQuery = 'SELECT count(b.id) as total FROM board b LEFT JOIN school s on s.id = b.school where s.town = ' + matchingRecord.town + ';';
					var completedBoardsQuery = 'SELECT count(b.id) FROM candivote RIGHT JOIN board b ON candivote.board = b.id WHERE candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND b.isProvisorio > 0 GROUP BY candivote.board;';
					var completedBoardsCertficateQuery = 'SELECT count(b.id) FROM candivote RIGHT JOIN board b ON candivote.board = b.id WHERE candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance) + ' AND b.isCertificate > 0 GROUP BY candivote.board;';
					
					if (req.query.isCertificate == "true") {
						completedBoardsQuery = completedBoardsCertficateQuery;
					} 
					if (!results) {
						results = [];
					}
					//console.log(totalBoards);
					Candivote.query(totalBoardsQuery, function (err, totalBoards) { 
						Candivote.query(completedBoardsQuery, function (err, completedBoards) { 
							res.ok({results: results, meta: {completed: completedBoards.length, total: totalBoards[0].total}});
						});
					});
				});
			}	
		});
	},
 	
 	exportCSV: function (req, res) {
	  	var pk = req.query.id;
	  	var schools = req.query.schools;
	  	var boards = req.query.boards;
	  	var groupBy = req.query.groupBy;
	  
	  		
	  	Config.findOne( pk ).populate('candidates').exec( function found( err, matchingRecord ) { 		
	  		if (matchingRecord) {
	  
	  			var candidates = [];
	  			 	_.each( matchingRecord.candidates, function ( candidate ) {
	  			 		candidates.push(candidate.id);
	  		 	} );			
	  
	  	 		var query = 'SELECT br.name as barrio, s.name as escuela, b.name as mesa, c.lastName as candidato, f.nombre as "lista", sum(candivote.votes) as votos FROM candivote RIGHT JOIN board b ON candivote.board = b.id LEFT JOIN borough br ON candivote.borough = br.id LEFT JOIN candidate c ON candivote.candidate = c.id LEFT JOIN `subforce` f ON c.subforce = f.id  LEFT JOIN school s on b.school = s.id where '; 
	  	 		query += 'candivote.candidate in (' + candidates.join(',') + ') AND c.id > 0 AND ';
	  
	  	 		if (schools) {
	  	 			query += 's.id in (' + schools.join(',') + ') AND c.id > 0 AND ';
	  	 		}
	  
	  	 		if (boards) {
	  	 			query += 'b.id in (' + boards.join(',') + ') AND c.id > 0 AND ';
	  	 		}
	  
	  
	  	 		query += 'candivote.config = ' + parseInt(req.query.id) + ' AND candivote.instance = ' + parseInt(req.query.instance);
	  	 		query += ' GROUP BY c.id ';

	  	 		if (groupBy === "school") {
	  	 			query += ', s.id ';
	  	 		} else {
					if (groupBy === "borough") {	  	 				
						query += ', br.id ';
					} else {
						query += ', b.id ';
					}
	  	 		}

	  	 		query += ' order by br.name, CAST(b.name as SIGNED), CAST(c.order AS SIGNED);';
	  
	  			Candivote.query(query, function (err, results) { 
	  	 			var config = {
	  	              fields : ['barrio','escuela', 'mesa', 'candidato', 'lista', 'votos'],
	  	              data: results
	  	            };
	  				

	  	            json2csv(config, function(err, csv) {
	  	              if (err) console.log(err);
	  	              var filename = matchingRecord.name.toLowerCase().replace(' ', '-') + ".csv";
	  	              res.attachment(filename);
	  	              res.end(csv, 'UTF-8');
	  	            });			
	  			}); 		
	  		}
	  	});
 	}
};

