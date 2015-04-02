import Ember from 'ember';

export
default Ember.Controller.extend({
	/* Revoir gestion de l'API */
	key: '7ea5f490261a949e52930517e1b4657c',
	url: 'https://api.themoviedb.org/3/',
	url_images: 'http://image.tmdb.org/t/p/w342/',

	current: function() {
		var movie = this.get('model')[0];
		return {
			movie: this.url_images + movie.backdrop_path
		};
	}.property('model'),

	onMoviesListLoaded: function() {
		var self = this,
			movie = this.get('model');

		var l = movie.map(function(m) {
			return self.getCastPromise(m.id);
		});
		Ember.RSVP.all(l).then(function(casts) {
			console.log(casts);
		});
	}.observes('model'),

	/*
	 * Request the movie's cast
	 * return Promise and the first 5 actors of the movie
	 * */
	getCastPromise: function(id_movie) {
		return Ember.$.getJSON(this.url + 'movie/' + id_movie +
				'/credits?api_key=' + this.key + '&callback=?')
			.then(function(data) {
				// Only the first 5 actors of the movie
				return data.cast.slice(0, 4).map(function(actor) {
					return {
						name: actor.name,
						id: actor.id,
						profile_path: actor.profile_path
					};
				});
			});
	},

	actions: {
		onPlay: function() {
			this.set('init_game', true);
		}
	}
});
