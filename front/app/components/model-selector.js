import Ember from 'ember';

export default Ember.Component.extend({
	optionValuePath: 'content',
	optionLabelPath: 'content.name',
	countryFilter: null,
	multiple: false,

	fieldFilter: null,
	valueFilter: null,

	data: Ember.computed('modelName', 'countryFilter', function () {

		if (this.get('fieldFilter')) {
			var filter = {};
			filter[this.get('fieldFilter')] = this.get('valueFilter');
			return this.get('store').find(this.get('modelName'), filter);
		} else {
			if (this.get('countryFilter')) {
				return this.get('store').find(this.get('modelName'), {country: this.get('countryFilter')});
			} else {
				return this.get('store').find(this.get('modelName'));
			}
		}
	}),
});
