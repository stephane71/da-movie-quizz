import Ember from 'ember';

export
default Ember.Route.extend({
	/* Revoir gestion de l'API */
	key: '7ea5f490261a949e52930517e1b4657c',
	url: 'https://api.themoviedb.org/3/',

	model: function() {
		return Ember.$.getJSON(this.url + 'movie/popular?api_key=' + this.key + '&callback=?')
			.then(function(movie) {
				return movie.results.map(function(m) {
					return {
						id: m.id,
						backdrop_path: m.backdrop_path,
						poster_path: m.poster_path
					};
				});
			});
	}
});
