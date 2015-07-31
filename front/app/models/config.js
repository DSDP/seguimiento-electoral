import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	type: DS.attr('string'),
	province: DS.belongsTo('province', {async: true}),
	town: DS.belongsTo('town', {async: true}),
	country: DS.belongsTo('country', {async: true}),
	charge: DS.belongsTo('charge', {async: true}),
	candidates: DS.hasMany('candidate', {async: true}),
});
