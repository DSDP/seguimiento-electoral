import DS from 'ember-data';

export default DS.Model.extend({
	board: DS.belongsTo('board', {async: true}),
  	config: DS.belongsTo('config', {async: true}),
  	candidates: DS.belongsTo('candidate', {async: true}),
  	votes: DS.attr('string')
});
