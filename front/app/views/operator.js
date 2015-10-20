import Ember from 'ember';

export default Ember.View.extend({
	team: null,
	candivotes: null,
	

	actions: {
		save: function () {

			var promises = Ember.A();
			var _this = this;
			
			this.get('candivotes').forEach(function (candivote) {
				if (candivote.get('isDirty')) {
					promises.push(candivote.save());
				}
			});	
			Ember.RSVP.Promise.all(promises).then(function(){ 
				_this.get('currentBoard').save();
			});
		},
	},

	isDirty: Ember.computed('candivotes.@each.isDirty', 'currentBoard.isDirty', function () {
		var isDirty = false;
		if (!this.get('candivotes')) {
			return false;	
		}
		if (this.get('currentBoard')) {
			isDirty = this.get('currentBoard').get('isDirty'); 
		}
		return this.get('candivotes').filterProperty('isDirty', true).length > 0 || isDirty;		
	}),

	schoolChanged: function () {
		this.set('currentBoard', null);
	}.observes('currentSchool'),

	charges: Ember.computed('currentBoard', 'configs', 'instances', function () {

		var charges = [];
		var _this = this;
		var promises = [];

		if (this.get('currentBoard') && this.get('configs') && this.get('instances')) {

			this.get('configs').forEach(function (config) {
				config.get('instances').forEach(function (instance) {
					promises.push(_this.get('store').find('candivote', {board: _this.get('currentBoard').get('id'), config: config.get('id'), instance: instance.get('id')}));
				});
			});

			Ember.RSVP.allSettled(promises).then(function(array){
				var candivotes = [];

				array.forEach(function (promise) {
					if (promise.state === 'fulfilled') {
						promise.value.forEach(function (candivote) {
							candivotes.pushObject(candivote);
						});
					}
				});

				_this.set('candivotes', candivotes);

				candivotes.forEach(function (candivote) {
					var charge = charges.findProperty('_id', candivote.get('config').get('id'));
					if (!charge) {
						charge = Ember.Object.create({
							_id: candivote.get('config').get('id'),
							config: candivote.get('config'),
							candidates: []
						});
						charges.pushObject(charge);
					}

					var candidate = charge.get('candidates').findProperty('_id', candivote.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							_id: candivote.get('candidate').get('id'),
							candidate: candivote.get('candidate'),
							candivote: candivote,
						});
						charge.get('candidates').pushObject(candidate);		
					}
				});
			}, function(error) {
				console.log(error);
			});
		}
		return charges;
	}),

	didInsertElement: function () {
		this._super();
	}
});
