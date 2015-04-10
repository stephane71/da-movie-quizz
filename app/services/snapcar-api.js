import Ember from 'ember';

export default Ember.Service.extend({
	key: 'z3HcUC86786lBdZS1aoWr5r5W9I3sz4dM5oU6zSU1z4O7L7H89SPE7G3023E797i',
	url: 'https://apisandbox.snapcar.com/public/',

	buildURL: function(type) {
		var url = this.url;
		if(type === 'history'){
			url += 'bookings/history';
		}
		else if(type === 'booking'){
			url += 'bookings';
		}
		return url + '?token=' + this.key;
	},

	ajax: function(url) {
		return Ember.$.getJSON(url);
   /*     return new Ember.RSVP.Promise(function(resolve, reject) {*/
			//Ember.$.ajax({
				//url: url,
				//type: 'GET',
				//dataType: "jsonp",

				//// This handler is not called for cross-domain script and cross-domain JSONP requests.
				//// http://api.jquery.com/jquery.ajax/
				//error: function(jqXHR, status, error) {
					//Ember.run(null, reject, [jqXHR, status, error]);
				//},

				//success: function(data) {
					//Ember.run(null, resolve, data);
				//}
			//});
		/*});*/
	},
	

	getBooking: function(){
		return [{"id":"rPfrWz$1qYKcYd5acPIeo:A","rider":{"id":"Jt1eDfWIjDUvTEBN2w6d3w","firstname":"Jonathan","lastname":"TIRET","email":"jonathan@snapcar.com"},"service_class":{"id":"dLjpx26LLzSIXesmK$fhXg","name":{"fr":"Executive","en":"Executive"}},"status":"pending","timezone":"Europe\/Paris","planned_start_date":1428673548,"creation_date":1428397800,"meeting_point":{"id":"XknywKSReUY2kMtzjNuU0Q","name":{"fr":"Devant l'h\u00f4tel Mercure","en":"In front of the Mercure Hotel"},"rdv_point":{"fr":"Votre chauffeur vous attendra devant l'h\u00f4tel Mercure, sortie Nord","en":"Your driver will be waiting for you in front of the Mercure Hotel."}},"start_location":{"lat":48.8805809021,"lng":2.3549880981445,"address":{"name":"Gare du Nord","postal_code":"75010","city":"Paris"}},"end_location":{"lat":48.8420918,"lng":2.3239225,"address":{"name":"23 Rue du D\u00e9part","postal_code":"75014","city":"Paris","country":"France"}},"driver_info":"Je ne sais pas si le train sera \u00e0 l'heure.","booking_price":{"id":"$HdWrk4v3RWYNV5OJHLkXA","expiry_date":1428398079,"formatted_price":"29,75 \u20ac","formatted_public_price":"0,00 \u20ac","price":29.75,"currency":"EUR","service_class":{"id":"dLjpx26LLzSIXesmK$fhXg","name":{"fr":"Executive","en":"Executive"}}},"nameboard":false}];
	}

});
