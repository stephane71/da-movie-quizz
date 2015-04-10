import Ember from 'ember';

export
default Ember.Controller.extend({
	resa: function() {
		var model = this.get('model');
		return model.map(function(resa) {
			return {
				rider: resa.rider.firstname + ' ' + resa.rider.lastname,
				info: resa.driver_info,
				start: resa.start_location.address.name,
				end: resa.end_location.address.name,
			};
		});
	}.property('model'),

	//resfresh: function() {
		//var self = this;
		//setInterval(function() {
			//self.send('resfresh_model');
		//}, 2000);
	/*}.on('init'),*/
});
