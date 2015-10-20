import Ember from 'ember';

export default Ember.ArrayController.extend({
	needs: ['application'],
	boardsCompletedPercent: '',
	boardsCompleted: '',
	boardsAll: '',
	lastUpdated: '',
});
