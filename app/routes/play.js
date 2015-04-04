import Ember from 'ember';

export
default Ember.Route.extend({
	/* Revoir gestion de l'API */
	key: '7ea5f490261a949e52930517e1b4657c',
	url: 'https://api.themoviedb.org/3/',
	
	// Choix du nombre d'acteurs / film
	NB_ACTORS: 5,

	setupController: function(controller, model) {
		var rand = [],
			l = model.length;
		for (var i = 0; i < l * 10; i++) {
			rand.push(Math.random() >= 0.5);
		}
		// rand_tab => liste de réponses Vrai/Faux
		controller.rand_tab = rand;
		controller.set('NB_ACTORS', this.NB_ACTORS);
		controller.set('model', model);
	},

	/*
	 * Model = liste des films les plus populaire
	 * une page = 20 films
	 * */
	model: function() {
		var self = this;
		return Ember.$.getJSON(this.url + 'movie/popular?api_key=' + this.key + '&callback=?')
			.then(function(movie) {
				// ? Charger uniquement les 2 premiers film avec leur casting 
				// pour gagner du temps de chargement?
				return movie.results;
			}).then(function(movie) {
				return self.getMoviesCastPromise(movie).then(function(casts) {
					return movie.map(function(m, i) {
						return {
							backdrop_path: m.backdrop_path,
							poster_path: m.poster_path,
							cast: casts[i]
						};
					});
				});
			});
	},

	getMoviesCastPromise: function(movies) {
		var self = this;
		var l = movies.map(function(m) {
			return self.getOneMovieCastPromise(m.id);
		});
		return Ember.RSVP.all(l);
	},

	/*
	 * Request the movie's cast
	 * return Promise and the first 5 actors of the movie
	 * */
	getOneMovieCastPromise: function(id_movie) {
		var nb_actors = this.NB_ACTORS;
		return Ember.$.getJSON(this.url + 'movie/' + id_movie +
				'/credits?api_key=' + this.key + '&callback=?')
			.then(function(data) {
				// Only the first 5 actors of the movie
				return data.cast.slice(0, nb_actors).map(function(actor) {
					return {
						name: actor.name,
						id: actor.id,
						profile_path: actor.profile_path
					};
				});
			});
	},
});
