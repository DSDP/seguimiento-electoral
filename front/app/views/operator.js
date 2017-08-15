import Ember from 'ember';

export default Ember.View.extend({
	team: null,
	candivotes: null,
	isSaving: false,

	actions: {
		save: function () {

			var promises = Ember.A();
			var _this = this;
			
				
			this.set('isSaving', true);
			
			/*
			this.get('candivotes').forEach(function (candivote) {
				if (candivote.get('isDirty')) {
					promises.push(candivote.save());
				}
			});	

			Ember.RSVP.Promise.all(promises).then(function(){ 
				_this.get('currentBoard').save().then(function () {
					_this.set('isSaving', false);
					_this.set('currentBoard', null);
				});
			});
			*/
			var cc = [];
			this.get('candivotes').forEach(function (candivote) {
				if (candivote.get('isDirty')) {
					cc.push({id: candivote.get('id'), votes: candivote.get('votes')});
				}
			});	
			if (cc.length > 0) {
				$.ajax({
			        type: "PUT",
			        url: 'http://45.55.137.6:1055/candivote/saveAll',
			        data: {candivotes: cc}	
				}).then(function (data) {
					if (data.isOk === true) {
						_this.get('currentBoard').save().then(function () {
							_this.set('isSaving', false);
							_this.set('currentBoard', null);
						})					
					}
				}, function (error) {
					console.log(error);
				})		
			} else {
				_this.get('currentBoard').save().then(function () {
					_this.set('isSaving', false);
					_this.set('currentBoard', null);
				})					
			}
		},
	},


	isValidVotes: Ember.computed('candivotes.@each.isDirty', 'candivotes.@each.votes', 'currentBoard.isDirty', 'currentBoard.votes', function () {
		var totalVotes = 0;

		this.get('candivotes').forEach(function (candivote) {
			totalVotes += parseInt(candivote.get('votes')) || 0;
		});	

		return totalVotes === parseInt(this.get('currentBoard.totalVotes'));
	}),


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
					if (!candivote.get('votes')) {
						candivote.set('votes', '0');
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
