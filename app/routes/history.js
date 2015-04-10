import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		var snapcarapi = this.get('snapcar-api'),
			url = snapcarapi.buildURL('history');

		return snapcarapi.ajax(url).then(function(data){
			return data.history;
		});
		//return snapcarapi.getBooking();
	}
});
