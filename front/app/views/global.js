import Ember from 'ember';

export default Ember.View.extend({
	isCertificate: true,
	teams: [],
	currentTeamIndex: 0,
	loading: false,
	reload: false,


	currentTeam: Ember.computed('teams', 'currentTeamIndex', function () {
		var t = this.get('teams').objectAt(this.get('currentTeamIndex'));
		if (t) {
			return t;
		} else {
			return null;
		}
	}),
	

	config: Ember.computed('currentTeam.configs', function () {
		if (this.get('currentTeam')) {
			return this.get('currentTeam').get('configs.content').objectAt(0);
		} else {
			return null;
		}
	}),

	instance: Ember.computed('config.instances', function () {
		return this.get('config').get('instances.content').objectAt(0);
	}),	

	

	boardsCompletedPercent: Ember.computed('meta', function () {
		var p = 0;
		if (this.get('meta')) {
			p = (this.get('meta.completed') / this.get('meta.total') * 100).toFixed(2);
			return p;
		}
		return p;
	}),

	lastUpdated: Ember.computed('boards.@each', function () {
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
			if (forces.get('candidates')) forces.get('candidates').sort(function(a, b){return b.get('percent') - a.get('percent')});
			forces.sort(function(a, b){return b.get('percent') - a.get('percent')});

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

			candidates.sort(function(a, b){return b.get('votes') - a.get('votes')});

		}
		return candidates;
	}),	

	_setUpdateTime: function (updateAt) {
		var _this = this;
		this.set('lu', null);
		Ember.run.next(function () {
			_this.set('lu', updateAt);
		})
	},	

	votesChanged: function () {
		var _this = this;
		if (this.get('config') && this.get('instance') && !this.get('loading')) {
			_this.set('loading', true);
			this.get('store').find('result', { id: this.get('config').get('id'), instance: this.get('instance').get('id'), isCertificate: this.get('isCertificate')}).then(function (votes) {
				if (votes) {
					_this.set('votes', []);
					_this.set('votes', votes);

					_this.set('meta', votes.get('meta'));
					var p = (_this.get('meta.completed') / _this.get('meta.total') * 100).toFixed(2);
					_this.set('ba', _this.get('meta.total'))
					_this.set('bc', _this.get('meta.completed'))
					_this.set('bcPercent', p);
						_this.get('store').find('result', { id: _this.get('config').get('id'), instance: _this.get('instance').get('id'), isBoards: true, isCertificate: _this.get('isCertificate')}).then(function (boards) {
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
							Ember.run.later(function () {
								_this.set('lastBoardsLoaded', true);
								_this.set('loading', false);
								Ember.run.later(function (){
									_this.set('currentTeamIndexLoaded', _this.get('currentTeamIndex'));
									if (_this.get('currentTeamIndex') == _this.get('teams.length') - 1) {
										_this.set('currentTeamIndex', 0);
									} else {
										_this.set('currentTeamIndex', _this.get('currentTeamIndex') + 1);
									}
									_this.set('votes', [])
								}, 10000)							
							}, 200);
						} 
					}, function (err) {
						console.log('error server');
						_this.set('loading', false);
						_this.toggleProperty('reload');
					});
				} 

			}, function (err) {
				console.log('error server');
				_this.set('loading', false);
				_this.toggleProperty('reload');			
			});
		}
	
	}.observes('config', 'instance', 'reload'),


	didInsertElement: function () {
		this._super();
		this.votesChanged();

		var _this = this;
	},	

	winningForces: Ember.computed('forces', function () {
		return this.get('forces').slice(0, 5);
	}),

	restForces: Ember.computed('forces', function () {
		return this.get('forces').slice(5, -1);
	}),

});
