import Ember from 'ember';

export default Ember.View.extend({


	boardsCompletedPercent: Ember.computed('meta', function () {
		var p = 0;
		if (this.get('meta')) {
			return (this.get('meta.completed') / this.get('meta.total') * 100).toFixed(2);
		}
		return p;
	}),



	candidates: Ember.computed('votes', function () {
		var candidates = [];
		var total= 0;
		var validTotal = 0;
		if (this.get('votes')) {
			this.get('votes').forEach(function(result) {
				if (result) {
					var candidate = candidates.findProperty('id', result.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							id: result.get('candidate').get('id'),
							candidate: result.get('candidate'),
							votes: 0
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
					validTotal += parseInt(result.get('totalVotes'));					
				}
			});

			candidates.forEach(function (candidate) {
				var p = (candidate.votes / total * 100).toFixed(2);
				var pt = (candidate.votes / validTotal * 100).toFixed(2);

				candidate.set('percent', p);
				candidate.set('totalPercent', pt);
			});	
		}
		return candidates;
	}),


	boroughs: Ember.computed('votes', function () {
		var boroughs = [];
		var total= 0;
		if (this.get('votes')) {
			this.get('votes').forEach(function(result) {
				if (result) {

					if (!result.get('totalVotes')) { 
						result.set('totalVotes', 0);
					}
					var borough = boroughs.findProperty('id', result.get('borough').get('id'));
					if (!borough) {
						borough = Ember.Object.create({
							id: result.get('borough').get('id'),
							borough: result.get('borough'),
							total: result.get('totalVotes'),
							candidates: []
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
					total += parseInt(result.get('votes'));					
				}
			});
			boroughs.forEach(function (borough) {
				borough.get('candidates').forEach(function (candidate) {
					console.log(borough.total);
					if (!borough.total) { 
						borough.total = 0;
					} 

					var p = (candidate.votes / total * 100).toFixed(2);
					var p2 = (candidate.votes / borough.total * 100).toFixed(2);
					
					if (!parseInt(p2)) {
						p2 = (0).toFixed(2);
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
		this.get('store').find('result', { id: this.get('config').get('id'), instance: this.get('instance').get('id') }).then(function (votes) {
			_this.set('votes', votes);

			_this.set('meta', votes.get('meta'));
		})			
	}.observes('autoRefresh', 'config'),

	didInsertElement: function () {
		this._super();
		this.votesChanged();
	}
});
