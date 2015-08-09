import DS from 'ember-data';

export default DS.Model.extend({
  	school: DS.belongsTo('school', {async: true}),
  	name: DS.attr('string'),
  	totalVotes: DS.attr('string'),
  	isCertificate: DS.attr('boolean'),
  	blankVotes: DS.attr('string'),
  	inpugnedVotes: DS.attr('string'),
  	recurredVotes: DS.attr('string'),
  	nullVotes: DS.attr('string'),
});
