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

	configs: Ember.computed('currentBoard', function () {

		var configs = [];
		var sIds = [];
		var cIds = [];
		var _this = this;
		var iIds = [];
		if (this.get('currentBoard')) {

			this.get('team.configs').forEach(function (config) {
				var schools = [];

				cIds.push(config.get('id'));

				_this.get('instances').forEach(function (instance) {
					iIds.push(instance.get('id'));
				});			
			});


			this.get('store').find('candivote', {board: this.get('currentBoard').get('id'), config: cIds, instance: iIds}).then(function (candivotes) {

				_this.set('candivotes', candivotes);

				candivotes.forEach(function (candivote) {
					var config = configs.findProperty('_id', candivote.get('config').get('id'));
					if (!config) {
						config = Ember.Object.create({
							_id: candivote.get('config').get('id'),
							config: candivote.get('config'),
							instances: [],
						});
						configs.pushObject(config);
					}

					var instance = config.get('instances').findProperty('_id', candivote.get('instance').get('id'));
					if (!instance) {
						instance = Ember.Object.create({
							_id: candivote.get('instance').get('id'),
							instance: candivote.get('instance'),
							schools: [],
						});
						config.get('instances').pushObject(instance);
					}


					var school = instance.get('schools').findProperty('_id', candivote.get('school').get('id'));
					
					if (!school) {
						school = Ember.Object.create({
							_id: candivote.get('school').get('id'),
							school: candivote.get('school'),
							boards: [],
						});
						instance.get('schools').pushObject(school);
					}

					var board = school.get('boards').findProperty('_id', candivote.get('board').get('id'));
					if (!board) {
						board = Ember.Object.create({
							_id: candivote.get('board').get('id'),
							board: candivote.get('board'),
							candidates: [],
						});
						school.get('boards').pushObject(board);	
					}
					var candidate = board.get('candidates').findProperty('_id', candivote.get('candidate').get('id'));
					if (!candidate) {
						candidate = Ember.Object.create({
							_id: candivote.get('candidate').get('id'),
							candidate: candivote.get('candidate'),
							candivote: candivote,
						});
						board.get('candidates').pushObject(candidate);		
					}
				});
			});
			
		}
		return configs;
	}),

	didInsertElement: function () {
		this._super();
	}
});
