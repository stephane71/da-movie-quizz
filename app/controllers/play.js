import Ember from 'ember';

export
default Ember.Controller.extend({
	url_images: 'http://image.tmdb.org/t/p/w342/',

	current: function() {
		var movie = this.get('model')[0];
		return {movie: this.url_images + movie.backdrop_path };
	}.property('model'),

	actions: {
		onPlay: function() {
			this.set('init_game', true);
		}
	}
});
