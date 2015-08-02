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

		if (RegExp('index').test(this.get('currentPath'))) {
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
				
				_self.sailsSocket.listenFor('candivote');
				_self.sailsSocket.listenFor('user');



				_self.sailsSocket.on('user.updated', function newMessageFromSails ( message ) {
					_self.get('session.user').then(function (newUser) {
						newUser.reload();
					});
				});

				_self.sailsSocket.on('candivote.updated', function newMessageFromSails ( message ) {
					Ember.run.next(this, function () {
						if (message.verb === 'updated') {
							if (message.id) {
								store.find('candivote', message.id).then(function (candivote) { 
									if (!candivote.get('isSaving')) {
										candivote.reload();
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
