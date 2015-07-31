import DS from 'ember-data';

export default DS.Model.extend({
  	name: DS.attr('string'),
  	country: DS.belongsTo('country', {async: true}),
  	towns: DS.hasMany('town', {inverse: 'province', async: true})
});
