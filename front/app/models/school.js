import DS from 'ember-data';

export default DS.Model.extend({
	town: DS.belongsTo('town', {async: true}),
	borough: DS.belongsTo('borough', {async: true}),
  	name: DS.attr('string'),
  	address: DS.attr('string'),
  	referring: DS.belongsTo('referring', {async: true}),
});
