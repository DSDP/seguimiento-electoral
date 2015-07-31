import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	members: DS.hasMany('user', {inverse: 'teams', async: true}),
	configs: DS.hasMany('config', {async: true})
});
