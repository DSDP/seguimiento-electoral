import Ember from 'ember';

export default Ember.Component.extend({
	candidateId: 1,
	candidates: null,

	style: Ember.computed('candidates', 'candidateId', function () {
		var style = '';
		if (this.get('candidates')) {
			this.get('candidates').forEach(function (candidate) {
				if (candidate.id == this.get('candidateId')) {
					style = 'width:' + candidate.percent + '%;';
				}
			}, this);
		} 
		return style;
	}),

	hasValue: Ember.computed('candidates', 'candidateId', function () { 
		var hasValue = false;
		if (this.get('candidates')) {
			this.get('candidates').forEach(function (candidate) {
				if (candidate.votes > 0) {
					hasValue = true
				}
			});
		}
		return hasValue;
	})
});
