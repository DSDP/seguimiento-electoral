import DS from 'ember-data';

export default DS.Model.extend({
  	name: DS.attr('string'),
  	lastName: DS.attr('string'),
  	telephone: DS.attr('string'),
  	altTelephone: DS.attr('string'),
  	photo: DS.belongsTo('asset', {async: true}),

	fullName: Ember.computed('name', 'lastName', function () {
		return this.get('lastName') + ', ' + this.get('name');
	}),  	
});
