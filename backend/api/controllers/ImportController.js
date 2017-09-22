/**
 * ImportController
 *
 * @description :: Server-side logic for managing fiscals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const fs = require('fs');
const lodash = require('lodash');
var Promise = require('promise');

module.exports = {

	readFile: function (fileName) {

		return new Promise(function (resolve, reject) {
			fs.readFile(fileName, 'utf8', function (err, buffer) {
			    if (err) {
			         return reject(err)
			    }
			    var br = buffer.toString('utf8');
			    
				var allTextLines = br.split(/\r\n|\n/);
				
				var headers = allTextLines[0].split(';');

				var lines = [];

				for (var i=1; i<allTextLines.length; i++) {       
				  var data = allTextLines[i].split(';');

				  if (data.length == headers.length) {
				      var tarr = {};

				      for (var j=0; j<headers.length; j++) {
				          tarr[headers[j]] = data[j];
				      }
				      lines.push(tarr);
				  }
				}    
			    return resolve(lines)
			});		    
		})		
	},
	province: function (req, res) {
		this.readFile('data/provincias.csv').then(function (lines) {
			Province.create(lines).exec(function (err, sections) {
				if (err) return next();
				return res.ok({message: 'Provincias creadas'});	
			});
		});
	},

	section: function (req, res) {
		this.readFile('data/secciones.csv').then(function (lines) {
			Section.create(lines).exec(function (err, sections) {
				if (err) return next();
				return res.ok({message: 'Secciones creados'});	
			});
		});
	},


	town: function (req, res) {
		this.readFile('data/distritos.csv').then(function (lines) {
			Town.create(lines).exec(function (err, towns) {
				if (err) return next();
				return res.ok({message: 'Distritos creados'});
			});
		});
	},

	circuit: function (req, res) {
		this.readFile('data/circuitos.csv').then(function (lines) {
			Borough.create(lines).exec(function (err, circuits) {
				if (err) return res.ok({message: err});
				return res.ok({message: 'Circuitos creados'});
			});
		});
	},	

	school: function (req, res) {

		var file = 'data/escuelas.csv';

		if (req.query.section) {
			file = 'data/escuelas_' + req.query.section + '.csv'
		}
		
		this.readFile('data/escuelas.csv').then(function (lines) {

			School.create(lines).exec(function (err, schools) {
				if (err)  {
					console.log(err);
					return res.ok({message: err});
				}

				var boards = [];

				_.each(schools, function (school) {
 					for (var i = school.startBoard; i <= school.endBoard; i++) {
		                var board = {
		                    name: i.toString(),
		                    school: school.id,
		                    section: school.section,
		                    town: school.town,
		                    borough: school.borough
		                }
		                boards.push(board);
              		}
				})

				Board.create(boards).exec(function (err, boards) {
					return res.ok({message: 'Escuelas Creadas'});
				})

			});
		});
	}
};

