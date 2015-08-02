import Ember from 'ember';

export default Ember.View.extend({
	votes: null,

	totalVotes: Ember.computed('votes', function () {
		var v = 0;
		this.get('votes').forEach(function (vote) {
			v += parseInt(vote.get('votes'));
		});

		return v;
	}),

	percent: Ember.computed('votesAll', 'totalVotes', function () {
		var v = 0;
		this.get('votesAll').forEach(function (vote) {
			v += parseInt(vote.get('votes'));
		});		

		return (parseInt(this.get('totalVotes')) * v / 100).toFixed(2);
	}),

	votesAll:  Ember.computed('candivotes', function () {
		var filter = [];
		this.get('candivotes.content').forEach(function (candivote) {
			
			var toPush = false;

			if (candivote.get('config').get('id') == this.get('config').get('id')) {
				toPush = true;
			}

			if (this.get('instance')) {
				toPush = false;
				if (this.get('instance').get('id') == candivote.get('instance').get('id')) {
					toPush = true;
				}
			}
			
			if (this.get('borough')) {
				toPush = false;
				if (this.get('borough').get('id') == candivote.get('borough').get('id')) {
					toPush = true;
				}
			}

			if (this.get('school')) {
				toPush = false;
				if (this.get('school').get('id') == candivote.get('school').get('id')) {
					toPush = true;
				}
			}

			if (this.get('board')) {
				toPush = false;
				if (this.get('board').get('id') == candivote.get('board').get('id')) {
					toPush = true;
				}
			}

			if (toPush) {
				filter.push(candivote);
			}
		}, this);

		return filter;
	}),

	votes:  Ember.computed('candivotes', function () {
		var filter = [];
		this.get('candivotes.content').forEach(function (candivote) {
			
			var toPush = false;

			if (candivote.get('config').get('id') == this.get('config').get('id')) {
				toPush = true;
			}

			if (this.get('instance')) {
				toPush = false;
				if (this.get('instance').get('id') == candivote.get('instance').get('id')) {
					toPush = true;
				}
			}
			
			if (this.get('borough')) {
				toPush = false;
				if (this.get('borough').get('id') == candivote.get('borough').get('id')) {
					toPush = true;
				}
			}

			if (this.get('candidate')) {
				toPush = false;
				if (this.get('candidate').get('id') == candivote.get('candidate').get('id')) {
					toPush = true;
				}
			}

			if (this.get('school')) {
				toPush = false;
				if (this.get('school').get('id') == candivote.get('school').get('id')) {
					toPush = true;
				}
			}

			if (this.get('board')) {
				toPush = false;
				if (this.get('board').get('id') == candivote.get('board').get('id')) {
					toPush = true;
				}
			}

			if (toPush) {
				filter.push(candivote);
			}
		}, this);

		return filter;
	}),
});
