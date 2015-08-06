import DS from 'ember-data';

export default DS.Model.extend({
	force: DS.belongsTo('force', {async: true}),
  	candidate: DS.belongsTo('candidate', {async: true}),
  	borough: DS.belongsTo('borough', {async: true}),
  	board: DS.belongsTo('board', {async: true}),
  	votes: DS.attr('number', {defaultValue: 0}),
  	totalVotes: DS.attr('number', {defaultValue: 0}),
  	updatedAt: DS.attr('string'),
});
