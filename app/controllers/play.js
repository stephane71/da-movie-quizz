import Ember from 'ember';

export
default Ember.Controller.extend({
	/* Revoir gestion de l'API */
	key: '7ea5f490261a949e52930517e1b4657c',
	url: 'https://api.themoviedb.org/3/',
	url_images: 'http://image.tmdb.org/t/p/w342/',

	// Choix du nombre d'acteurs / film
	NB_ACTORS: 5,

	current: function() {
		var movie = this.get('model')[0];
		return {
			movie: this.url_images + movie.backdrop_path
		};
	}.property('model'),

	onMoviesListLoaded: function() {
		var self = this,
			movie = this.get('model');

		// ? Charger uniquement les 2 premiers film avec leur casting 
		// pour gagner du temps de chargement?
		
		var l = movie.map(function(m) {
			return self.getCastPromise(m.id);
		});
		Ember.RSVP.all(l).then(function(casts) {
			console.log(casts);
			self.set('casts', casts);
			//self.get('tuple');
		});
	}.observes('model'),

	current_index: 0,

	current_answer_type: function() {
		return this.rand_tab[this.current_index];
	}.property('current_index'),

	/*
	 * Init: création d'un tableau aléatoire de réponses V/F
	 * Vrai:1 Faux:0
	 * 1/ sélectionner le type de réponse dans le tableau V/F
	 * 2/ Choix d'un ID film aléatoire && choix d'un ID acteur aléatoire
	 * 3/ 	Si rep Vrai
	 * 			=> Sélectionner le film et l'acteur à partir des 2 IDs précédent 
	 * 		Si rep Fausse
	 * 			=> Sélectionner l'acteur à partir des 2 IDs précédent 
	 * 			=> Sélectionner un autre film aléatoire
	 * */
	tuple: function() {
		if (!this.get('casts')) {
			return;
		}
		var tuple;
		var rand_movie_id = Math.floor(Math.random() * (this.get('model').length));
		var rand_actor_id = Math.floor(Math.random() * this.NB_ACTORS + 1);

		if (this.get('current_answer_type')) {
			tuple = this.getCorrectTuple(rand_movie_id, rand_actor_id);
		} else {
			tuple = this.getCorrectTuple(rand_movie_id, rand_actor_id);
			//tuple = self.getWrongTuple(rand_movie_id, rand_actor_id);
		}
		return tuple;
	}.property('casts'),
	//}.property('current_answer_type'),

	getCorrectTuple: function(m_id, a_id) {
		var movie = this.get('model')[m_id];
		var actor = this.get('casts')[m_id][a_id];
		return {
			movie: this.url_images + movie.backdrop_path,
			actor: this.url_images + actor.profile_path
		};
	},

	getWrongTuple: function(m_id, a_id) {

	},

	/*
	 * Request the movie's cast
	 * return Promise and the first 5 actors of the movie
	 * */
	getCastPromise: function(id_movie) {
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

	actions: {
		onPlay: function() {
			this.set('init_game', true);
		}
	}
});
