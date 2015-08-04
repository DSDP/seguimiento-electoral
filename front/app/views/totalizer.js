import Ember from 'ember';

export default Ember.View.extend({
	votes: null,

	votesChanged: function () {
		var _this = this;
		$.ajax({
			type: "POST",
			url: "http://localhost:1337/api/configs/total/" + this.get('config').get('id'),
			data: { 
				candidate: this.get('candidate').get('id'), 
				instance: this.get('instance').get('id'), 
				country: this.get('config').get('country').get('id'), 
				province: this.get('config').get('province').get('id'), 
				town: this.get('config').get('town').get('id'), 
			},
			success : function(data) {
              _this.set('votes', data);
            }			
		})			
	}.observes('autoRefresh', 'candidate', 'config'),

	didInsertElement: function () {
		this._super();
		this.votesChanged();
	}
});
