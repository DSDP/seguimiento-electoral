import DS from 'ember-data';

export default DS.Model.extend({
  	town: DS.belongsTo('town', {async: true}),
  	name: DS.attr('string', {async: true}),
  	schools: DS.hasMany('school', {inverse: 'borough', async: true}),
});
