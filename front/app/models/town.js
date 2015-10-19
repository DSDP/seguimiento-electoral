import DS from 'ember-data';

export default DS.Model.extend({
  	name: DS.attr('string'),
  	places: DS.attr('string'),
  	province: DS.belongsTo('province', {async: true}),
  	boroughs: DS.hasMany('borough', {inverse: 'town', async: true}),
  	schools: DS.hasMany('school', {inverse: 'town', async: true}),
});
