import Ember from 'ember';

export default Ember.View.extend({
	team: null,
	candivotes: null,

	actions: {
		save: function () {
			this.get('candivotes').forEach(function (candivote) {
				if (candivote.get('isDirty')) {
					candivote.save();
				}
			});	

			if (this.get('currentBoard').get('isDirty')) {
				this.get('currentBoard').save();
			}
		},
	},

	isDirty: Ember.computed('candivotes.@each.isDirty', 'currentBoard.isDirty', function () {
		if (this.get('currentBoard')) {
			return this.get('currentBoard').get('isDirty'); 
		}
		return this.get('candivotes').filterProperty('isDirty', true).length > 0;		
	}),

	schoolChanged: function () {
		this.set('currentBoard', null);
	}.observes('currentSchool'),

	candidates: Ember.computed('currentBoard', 'instance', 'config', function () {

		var candidates = [];
		var sIds = [];
		var cIds = [];
		var _this = this;
		var iIds = [];
		if (this.get('currentBoard')) {

			this.get('store').find('candivote', {board: this.get('currentBoard').get('id'), config: this.get('config').get('id'), instance: this.get('instance').get('id')}).then(function (candivotes) {

				_this.set('candivotes', candivotes);

				candivotes.forEach(function (candivote) {
					var candidate = candidates.findProperty('_id', candivote.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							_id: candivote.get('candidate').get('id'),
							candidate: candivote.get('candidate'),
							candivote: candivote,
						});
						candidates.pushObject(candidate);		
					}
				});
			});
			
		}
		return candidates;
	}),

	didInsertElement: function () {
		this._super();
	}
});
