import Ember from 'ember';

export default Ember.View.extend({
	teamChanged: function () {
		var sIds = [];
		var cIds = [];
		var _this = this;
		var iIds = [];


		this.get('team.configs').forEach(function (config) {
			var schools = [];

			cIds.push(config.get('id'));

		});

		_this.get('instances').forEach(function (instance) {
			iIds.push(instance.get('id'));
		});			


		this.get('store').find('candivote', {config: cIds, instance: iIds}).then(function (candivotes) {
			_this.set('candivotes', candivotes);
		});
	}.observes('team'),	

	didInsertElement: function () {
		this._super();
		this.teamChanged();
	}	
});
