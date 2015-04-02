import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		onPlay: function() {
			this.set('init_game', true);
		}
	}
});
