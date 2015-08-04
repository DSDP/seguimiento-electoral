import Ember from 'ember';

export default Ember.Controller.extend({
	types: ['Nacional', 'Provincial', 'Distrital'],

	isNational: Ember.computed('model.type', function () {
		return this.get('model.type') === 'Nacional';
	}),

	isProvincial: Ember.computed('model.type', function () {
		return this.get('model.type') === 'Provincial';
	}),

	isDistrictal: Ember.computed('model.type', function () {
		return this.get('model.type') === 'Distrital';
	}),	
});
