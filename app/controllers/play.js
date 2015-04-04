import Ember from 'ember';

export
default Ember.Controller.extend({
	/* Revoir gestion de l'API */
	url_images: 'http://image.tmdb.org/t/p/w342/',

	onMoviesListLoaded: function() {
		if (this.get('current_index') > 0) {
			return;
		}
		this.set('current_index', 0);
	}.observes('model'),

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
		var tuple,
			rand_movie_id = this.getRandomMovieID(),
			rand_actor_id = this.getRandomActorID();

		if (this.rand_tab[this.current_index]) {
			tuple = this.getCorrectTuple(rand_movie_id, rand_actor_id);
		} else {
			tuple = this.getWrongTuple(rand_movie_id, rand_actor_id);
		}
		return tuple;
	}.property('current_index'),

	getCorrectTuple: function(m_id, a_id) {
		var movie = this.getMovie(m_id);
		var actor = movie.cast[a_id];
		return {
			movie: this.url_images + movie.poster_path,
			actor: this.url_images + actor.profile_path
		};
	},

	getWrongTuple: function(m_id, a_id) {
		var new_movie_id = m_id;
		// Le 2ème film choisi doit être différent du 1er 
		while (new_movie_id === m_id) {
			new_movie_id = this.getRandomMovieID();
		}
		var new_movie = this.getMovie(m_id),
			actor = this.getMovie(new_movie_id).cast[a_id];
		return {
			movie: this.url_images + new_movie.poster_path,
			actor: this.url_images + actor.profile_path
		};
	},

	/*
	 * movie = {
	 * 	backdrop_path: ...,
	 * 	poster_path:...,
	 * 	cast: [{name:..., profile_path...}, ...]
	 * }
	 * */
	getMovie: function(id_movie) {
		return this.get('model')[id_movie];
	},

	getRandomMovieID: function() {
		// jamais 2 fois le même film à la suite
		var n = Math.floor(Math.random() * (this.get('model').length));
		while (n === this.current_id_movie) {
			n = Math.floor(Math.random() * (this.get('model').length));
		}
		this.current_id_movie = n;
		return n;
	},

	getRandomActorID: function() {
		return Math.floor(Math.random() * this.NB_ACTORS);
	},

	actions: {
		onPlay: function() {
			this.set('init_game', true);
		},

		onSelection: function(bool) {
			// Reaload le model après 15 clicks
			if (this.get('current_index') > 15) {
				this.send('refreshModel');
				this.set('current_index', 0);
				return;
			}
			this.incrementProperty('current_index');
		}
	}
});
