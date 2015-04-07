import Ember from 'ember';

export default Ember.Route.extend({
	redirect: function(model, transition){
		this.transitionTo('play');
	}
});
