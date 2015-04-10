import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		var snapcarapi = this.get('snapcar-api'),
			url = snapcarapi.buildURL('booking');

		return snapcarapi.ajax(url).then(function(data){
			return data;
		});
		
		//return snapcarapi.getBooking();
	},

	 actions: {
		refresh_model: function(){
			this.refresh();
		}
	 }
});
