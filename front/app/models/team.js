import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	configs: DS.hasMany('config', {async: true})
});
