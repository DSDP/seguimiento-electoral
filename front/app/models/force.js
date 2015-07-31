import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	color: DS.attr('string'),
	initials: DS.attr('string'),
	history: DS.attr('string'),
	logo: DS.belongsTo('asset', {async: true}),
});
