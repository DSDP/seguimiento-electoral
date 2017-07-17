import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
	setupController: function (controller, model) {
		this._super(controller, model);
		this.get('session.user').then(function (user) {
			controller.set('currentTeam', user.get('teams').firstObject);
			console.log(controller.get('currentTeam'));
		});
	}
});
