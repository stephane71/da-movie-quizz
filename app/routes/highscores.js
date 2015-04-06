import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
//		return this.store.find('highscore').sortBy('score').reverse();
		return this.store.all('highscore').sortBy('score').reverse();
	}
});
