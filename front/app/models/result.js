import DS from 'ember-data';

export default DS.Model.extend({
  	candidate: DS.belongsTo('candidate', {async: true}),
  	borough: DS.belongsTo('borough', {async: true}),
  	votes: DS.attr('number'),
  	totalVotes: DS.attr('number')
});
