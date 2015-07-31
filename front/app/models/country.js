import DS from 'ember-data';

export default DS.Model.extend({
  	name: DS.attr('string'),
  	flag: DS.belongsTo('asset', {async: true}),
  	provinces: DS.hasMany('province', {inverse: 'country', async: true}),
});
