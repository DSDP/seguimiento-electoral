import DS from 'ember-data';

export default DS.Model.extend({
  	school: DS.belongsTo('school', {async: true}),
  	name: DS.attr('string'),
  	totalVotes: DS.attr('string')
});
