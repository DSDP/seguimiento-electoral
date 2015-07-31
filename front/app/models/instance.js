import DS from 'ember-data';

export default DS.Model.extend({
  	name: DS.attr('string'),
  	roles: DS.hasMany('role'),
});
