import Ember from 'ember';

export
default Ember.Route.extend({
	/* Revoir gestion de l'API */
	key: '7ea5f490261a949e52930517e1b4657c',
	url: 'https://api.themoviedb.org/3/',

	setupController: function(controller, model) {
		var rand = [],
			l = model.length;
		for (var i = 0; i < l * 10; i++) {
			rand.push(Math.random() >= 0.5);
		}
		// rand_tab => liste de réponses Vrai/Faux
		controller.rand_tab = rand;
		controller.set('model', model);
	},

	/*
	 * Model = liste des films les plus populaire
	 * une page = 20 films
	 * */
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
