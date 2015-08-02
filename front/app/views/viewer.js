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

			_this.get('schools').forEach(function (school) {
				sIds.push(school.get('id'));
			});

			_this.get('instances').forEach(function (instance) {
				iIds.push(instance.get('id'));
			});			
		});


		this.get('store').find('candivote', {school: sIds, config: cIds, instance: iIds}).then(function (candivotes) {
			var configs = [];

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
						boroughs: [],
					});
					config.get('instances').pushObject(instance);
				}


				//var borough = instance.get('boroughs').findProperty('_id', candivote.get('borough').get('id'));
				var borough = instance.get('boroughs').findProperty('_id', candivote.get('borough').get('id'));
				if (!borough) {
					borough = Ember.Object.create({
						_id: candivote.get('borough').get('id'),
						borough: candivote.get('borough'),
						schools: [],
					});
					instance.get('boroughs').pushObject(borough);
				}

				var school = borough.get('schools').findProperty('_id', candivote.get('school').get('id'));
				
				if (!school) {
					school = Ember.Object.create({
						_id: candivote.get('school').get('id'),
						school: candivote.get('school'),
						boards: [],
					});
					borough.get('schools').pushObject(school);
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

			_this.set('configs', configs);
		});
	}.observes('team.configs'),	
});
