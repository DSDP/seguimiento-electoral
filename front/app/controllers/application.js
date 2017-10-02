import Ember from 'ember';

export default Ember.Controller.extend({
	isShowMenu: false,
	isShowClick: false,
	isShowApps: false,

	init: function () {
		this._super();
		this.subscribe();
	},

	getCurrentURL: function () {
		this.set('isAdmin', false);
		this.set('isDataEntry', false);
		this.set('isHome', false);

		if (RegExp('index').test(this.get('currentPath')) || RegExp('global').test(this.get('currentPath'))) {
			this.set('isHome', true);
		}
		
		if (RegExp('admin').test(this.get('currentPath'))) {
			this.set('isAdmin', true);
			this.set('isHome', false);
		}		
		if (RegExp('data-entry').test(this.get('currentPath'))) {
			this.set('isDataEntry', true);
			this.set('isHome', false);
		}		

	}.observes('currentPath'),

	subscribe: function () {
		var store = this.store;
		var _self = this;
		if (this.get('session.user_id')) {
			this.get('session.user').then(function (user) {
			
				_self.sailsSocket.request('get', '/socket/subscribePoliticalData', {user: _self.get('session.user_id')}).then(function(response) { console.log(response); }, function(reason) {
					console.log(reason);
				});
				
				_self.sailsSocket.listenFor('config');

				_self.sailsSocket.on('config.updated', function newMessageFromSails ( message ) {
					
					Ember.run.next(this, function () {

						if (message.verb === 'updated') {
							if (message.id) {
								store.find('config', message.id).then(function (config) { 
									if (!config.get('isSaving')) {
										config.reload();
									}
								});
								
								if (!_self.get('autoRefresh')) {
									_self.set('autoRefresh', true);	
								} else {
									_self.set('autoRefresh', false);
								}								
							}
						}
					});				
				});	

				_self.sailsSocket.on('team.updated', function newMessageFromSails ( message ) {
					Ember.run.next(this, function () {
						if (message.verb === 'updated') {
							if (message.id) {
								store.find('team', message.id).then(function (team) { 
									if (!team.get('isSaving')) {
										team.reload();
									}
								});
							}
						}
					});				
				});										
			})
		}			
	}.observes('session.user_id'),
});
