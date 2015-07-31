import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';



export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function (arg) {
		console.log(arg);
		return this.get('store').find('config', arg.config_id);
	},

	setupController: function (controller, model) {
		controller.set('model', model);
		console.log(controller);
	},
});
