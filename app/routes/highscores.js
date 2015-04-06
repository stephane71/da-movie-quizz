import Ember from 'ember';

export
default Ember.Route.extend({
	model: function() {
		return this.store.find('highscore').then(function(data) {
			return data.sortBy('score').reverse();
		});
	},

	actions: {
		resetHighscores: function() {
			this.store.find('highscore').then(function(data) {
				data.forEach(function(record) {
					record.destroyRecord();
				});
			});
		}
	}
});
