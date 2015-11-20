import Ember from 'ember';

export default Ember.View.extend({
	isCertificate: false,
	town: null,

	boardsCompletedPercent: Ember.computed('meta', function () {
		var p = 0;
		if (this.get('meta')) {
			p = (this.get('meta.completed') / this.get('meta.total') * 100).toFixed(2);
			return p;
		}
		return p;
	}),
	lastBoardsLoaded: false,

	lastBoards: Ember.computed('boards', function () { 
		var boards = [];
		var total= 0;
		var _this = this;
		if (this.get('boards')) {
			this.get('boards').forEach(function(result) {
				if (result) {

					if (!result.get('totalVotes')) { 
						result.set('totalVotes', 0);
					}
					var board = boards.findProperty('id', result.get('board').get('id'));
					if (!board) {
						board = Ember.Object.create({
							id: result.get('board').get('id'),
							board: result.get('board'),
							total: result.get('totalVotes'),
							candidates: []
						});
						boards.pushObject(board);
					}

					var candidate = board.get('candidates').findProperty('id', result.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							id: result.get('candidate').get('id'),
							candidate: result.get('candidate'),
							votes: 0
						});
						board.get('candidates').pushObject(candidate);
					}
					if (!result.get('votes')) { 
						result.set('votes', 0);
					}

					candidate.votes += parseInt(result.get('votes'));
					total += parseInt(result.get('votes'));					
				}
			});
			boards.forEach(function (board) {
				board.get('candidates').forEach(function (candidate) {

					if (!board.total) { 
						board.total = 0;
					} 

					var p = (candidate.votes / total * 100).toFixed(2);
					var p2 = (candidate.votes / board.total * 100).toFixed(2);
					
					if (!parseInt(p2)) {
						p2 = (0).toFixed(2);
					}

					if (!parseInt(p)) {
						p = (0).toFixed(2);
					}

					candidate.set('percent', p);
					candidate.set('totalPercent', p2);
				});	
			});
		}

		return boards;
	}),

	lastUpdated: Ember.computed('boards.@each', 'refreshTime', function () {
		var _this = this;
		if (this.get('boards')) { 
			if (this.get('boards').objectAt(0)) {
				if (_this.get('interval')) {
					clearInterval(_this.get('interval'));
				}
				var interval = setInterval(function () {
					clearInterval(_this.get('interval'));
					_this.set('refreshTime', !_this.get('refreshTime'));
					if (_this.get('boards').objectAt(0)) {
						_this.set('lu', _this.get('boards').objectAt(0).get('updatedAt'));
					}						
				}, 5000);
				_this.set('interval', interval);
				this.set('lu', this.get('boards').objectAt(0).get('updatedAt'));
				return this.get('boards').objectAt(0).get('updatedAt');
			}
		}
	}),


	_setUpdateTime: function (updateAt) {
		var _this = this;
		this.set('lu', null);
		Ember.run.next(function () {
			_this.set('lu', updateAt);
		})
	},

	forces: Ember.computed('votes.@each', 'votes', function () { 
		var forces = [];
		var total= 0;
		if (this.get('votes')) {
			this.get('votes').forEach(function(result) {
				if (result) {

					if (!result.get('totalVotes')) { 
						result.set('totalVotes', 0);
					}
					var force = forces.findProperty('id', result.get('force').get('id'));
					if (!force) {
						force = Ember.Object.create({
							id: result.get('force').get('id'),
							force: result.get('force'),
							total: result.get('totalVotes'),
							candidates: [],
							votes: 0,
						});
						forces.pushObject(force);
					}

					var candidate = force.get('candidates').findProperty('id', result.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							id: result.get('candidate').get('id'),
							candidate: result.get('candidate'),
							votes: 0
						});
						force.get('candidates').pushObject(candidate);
					}
					if (!result.get('votes')) { 
						result.set('votes', 0);
					}

					candidate.votes += parseInt(result.get('votes'));
					force.votes += parseInt(result.get('votes'));
					total += parseInt(result.get('votes'));					
				}
			});
			forces.forEach(function (force) {
				force.get('candidates').forEach(function (candidate) {
					if (!force.total) { 
						force.total = 0;
					} 

					var p = (candidate.votes / total * 100).toFixed(2);
					var p2 = (candidate.votes / force.total * 100).toFixed(2);
					
					if (!parseFloat(p2)) {
						p2 = (0).toFixed(2);
					}

					if (!parseFloat(p)) {
						p = (0).toFixed(2);
					}

					candidate.set('percent', p);
					candidate.set('totalPercent', p2);
				});	
				var bp = (force.get('votes') / total * 100).toFixed(2);

				if (!parseFloat(bp)) {
					bp = (0).toFixed(2);
				}				
				force.set('percent', bp);
			});
		}
		return forces;		
	}),

	candidates: Ember.computed('votes.@each', function () {
		var candidates = [];
		var total= 0;
		if (this.get('votes')) {
			this.get('votes').forEach(function(result) {
				if (result) {
					var candidate = candidates.findProperty('id', result.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							id: result.get('candidate').get('id'),
							candidate: result.get('candidate'),
							votes: 0,
							validTotal: 0,
						});
						candidates.pushObject(candidate);
					}
					if (!result.get('votes')) { 
						result.set('votes', 0);
					}
					if (!result.get('totalVotes')) { 
						result.set('totalVotes', 0);
					}					
					candidate.votes += parseInt(result.get('votes'));
					total += parseInt(result.get('votes'));					
					candidate.validTotal += parseInt(result.get('totalVotes'));					
				}
			});
			var fpvVotes = 0;
			var validTotal = 0;
			candidates.forEach(function (candidate) {
				var p = (candidate.votes / total * 100).toFixed(2);
				var pt = (candidate.votes / candidate.validTotal * 100).toFixed(2);
				if (!parseFloat(pt)) {
					pt = (0).toFixed(2);
				}

				if (!parseFloat(p)) {
					p = (0).toFixed(2);
				}
				fpvVotes += candidate.votes;
				validTotal = candidate.validTotal;
				candidate.set('percent', p);
				candidate.set('totalPercent', pt);
			});	
			var fpv = (fpvVotes / validTotal * 100).toFixed(2);
			if (!parseFloat(fpv)) {
				fpv = (0).toFixed(2);
			}			
			this.set('votosFPV', fpv);
		}
		return candidates;
	}),

	boroughsList: Ember.computed('votes.@each', 'autoRefresh', function () {
		var boroughs = Ember.ArrayController.create();
		var total= 0;
		if (this.get('votes')) {
			this.get('votes').forEach(function(result) {
				if (!result.get('totalVotes')) { 
					result.set('totalVotes', 0);
				}
				var borough = boroughs.findProperty('id', result.get('borough').get('id'));
				if (!borough) {
					borough = Ember.Object.create({
						id: result.get('borough').get('id'),
						borough: result.get('borough'),
						total: result.get('totalVotes'),
						totalCandidates: 0,
						candidates: Ember.ArrayController.create()
					});
					boroughs.pushObject(borough);
				}

				var candidate = borough.get('candidates').findProperty('id', result.get('candidate').get('id'));
				if (!candidate) {
					candidate = Ember.Object.create({
						id: result.get('candidate').get('id'),
						candidate: result.get('candidate'),
						votes: 0
					});
					borough.get('candidates').pushObject(candidate);
				}
				if (!result.get('votes')) { 
					result.set('votes', 0);
				}

				candidate.votes += parseInt(result.get('votes'));
				borough.totalCandidates += parseInt(result.get('votes'));
				total += parseInt(result.get('votes'));					
			});
			boroughs.forEach(function (borough) {
				borough.get('candidates').forEach(function (candidate) {
					if (!borough.total) { 
						borough.total = 0;
					} 

					var p = (candidate.votes / borough.totalCandidates * 100).toFixed(2);
					var p2 = (candidate.votes / borough.total * 100).toFixed(2);
					
					if (!parseFloat(p2)) {
						p2 = (0).toFixed(2);
					}

					if (!parseFloat(p)) {
						p = (0).toFixed(2);
					}

					candidate.set('percent', p);
					candidate.set('totalPercent', p2);
				});	
			});
		}
		return boroughs;
	}),

	votesChanged: function () {
		var _this = this;
		if (this.get('config') && this.get('instance')) {
			this.get('store').find('result', { id: this.get('config').get('id'), instance: this.get('instance').get('id'), isCertificate: this.get('isCertificate')}).then(function (votes) {
				_this.set('votes', []);
				_this.set('votes', votes);

				_this.set('meta', votes.get('meta'));
				var p = (_this.get('meta.completed') / _this.get('meta.total') * 100).toFixed(2);
				_this.set('ba', _this.get('meta.total'))
				_this.set('bc', _this.get('meta.completed'))
				_this.set('bcPercent', p);

			});

			this.get('store').find('result', { id: this.get('config').get('id'), instance: this.get('instance').get('id'), isBoards: true, isCertificate: this.get('isCertificate')}).then(function (boards) {
				if (boards) {
					_this.set('lastBoardsLoaded', false);
					_this.set('boards', boards);
					if (_this.get('boards').objectAt(0)) {
						if (_this.get('interval')) {
							clearInterval(_this.get('interval'));
						}
						var interval = setInterval(function () {
							//clearInterval(_this.get('interval'));
							_this.set('refreshTime', !_this.get('refreshTime'));
							if (_this.get('boards').objectAt(0)) {
								_this.set('lu', _this.get('boards').objectAt(0).get('updatedAt'));
								_this._setUpdateTime(_this.get('boards').objectAt(0).get('updatedAt'));
							}							
						}, 5000);
						_this.set('interval', interval);
						if (_this.get('boards').objectAt(0)) {
							_this.set('lu', _this.get('boards').objectAt(0).get('updatedAt'));
						}
					}	
					Ember.run.next(function () {
						_this.set('lastBoardsLoaded', true);
					});
				}

			});

		}
	}.observes('autoRefresh', 'config', 'instance'),

	didInsertElement: function () {
		this._super();
		this.votesChanged();
	},

	//coeficiente = Total de votos / parseInt(town.places)

	//candidate.votes / coeficiente = Cantidad de bancas

	coefficient: Ember.computed('forces.@each', 'config.town.places', function () {
		var totalVotes = 0;
		if (this.get('config').get('town') && this.get('config').get('town').get('places')) {
			this.get('forces').forEach(function (force) {
				totalVotes += force.get('votes');
			});
			totalVotes = totalVotes / parseInt(this.get('config').get('town').get('places'));
		}
		return totalVotes;
	}),

	forcePlaces: Ember.computed('coefficient', function () {
		var forcePlaces = [];
		var coefficient = this.get('coefficient');
		var totalPlaces = 0;
		this.get('forces').forEach(function (force) {
			var percent = force.get('votes') / coefficient;
			var places = Math.floor(percent);

			if (places >= 1) {
				var forcePlace = Ember.Object.create({
					force: force.force,
					places: places,
					percent: percent,
					remainder: ((percent - places) * coefficient).toFixed(0)
				});
				totalPlaces += places;
				forcePlaces.pushObject(forcePlace);
			}
		});	

		forcePlaces.sort(function(a, b){return b.get('remainder') - a.get('remainder')});
		var restPlaces = parseInt(this.get('config').get('town').get('places')) - totalPlaces;

		if (restPlaces > 0 && this.get('coefficient') > 0) {
			for (var i = 0; i < restPlaces; i++) {
				var forcePlace = forcePlaces.objectAt(i);
				forcePlace.set('places', forcePlace.get('places') + 1);
			}
		}

		forcePlaces.sort(function(a, b){return b.get('percent') - a.get('percent')});

		return forcePlaces;
	}),
});
