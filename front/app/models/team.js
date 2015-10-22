import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	configs: DS.hasMany('config', {async: true}),

	orderedConfigs: Ember.computed('configs.@each.orden', function () {
		if (this.get('configs')) {
			return this.get('configs').sortBy('orden');
		} else {
			return [];
		}
	}),
});
