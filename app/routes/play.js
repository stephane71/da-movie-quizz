import Ember from 'ember';

export
default Ember.Route.extend({
	/* Revoir gestion de l'API */
	key: '7ea5f490261a949e52930517e1b4657c',
	url: 'https://api.themoviedb.org/3/',

	// Choix du nombre d'acteurs / film
	NB_ACTORS: 5,
	page: 1,

	setupController: function(controller, model) {
		var rand = [],
			l = model.length;
		for (var i = 0; i < l * 10; i++) {
			rand.push(Math.random() >= 0.5);
		}
		// rand_tab => liste de réponses Vrai/Faux
		controller.rand_tab = rand;
		controller.set('NB_ACTORS', this.NB_ACTORS);
		controller.set('NB_MOVIES', model.length);

		controller.set('model', model);
	},

	/*
	 * Model = liste des films les plus populaire
	 * une page = 20 films
	 * */
	model: function() {
		var self = this;
		return Ember.$.getJSON(this.url + 'movie/popular?api_key=' +
				this.key + '&page=' + this.page + '&callback=?')
			.then(function(movie) {
				// ? Charger uniquement les 5 premiers film avec leur casting 
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
					}).filter(function(m) {
						return m.cast.length >= self.NB_ACTORS;
					});
				});
			});
	},

	actions: {
		refreshModel: function() {
			this.page++;
			this.refresh();
		}
	},

	/************************************************/
	/**** Promise for https://www.themoviedb.org ****/
	/************************************************/

	getMoviesCastPromise: function(movies) {
		var self = this;
		return Ember.RSVP.all(movies.map(function(m) {
			return self.getOneMovieCastPromise(m.id);
		}));
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
				return data.cast.filter(function(actor) {
					// data incomplete
					if (actor.profile_path === null) {
						return false;
					}
					return true;
				});
			}).then(function(data) {
				// Only the first 5 actors of the movie
				return data.slice(0, nb_actors).map(function(actor) {
					return {
						name: actor.name,
						id: actor.id,
						profile_path: actor.profile_path
					};
				});
			});
	},
});
