import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function (arg) {
		return this.get('store').find('team', arg.team_id);
	},

	setupController: function (controller, model) {
		controller.set('model', model);
	},
});
