import DS from 'ember-data';

export default DS.Model.extend({
	school: DS.belongsTo('school', {async: true}),
	board: DS.belongsTo('board', {async: true}),
  	config: DS.belongsTo('config', {async: true}),
  	borough: DS.belongsTo('borough', {async: true}),
  	candidate: DS.belongsTo('candidate', {async: true}),
  	instance: DS.belongsTo('instance', {async: true}),
  	votes: DS.attr('string', {defaultValue: '0'})
});
