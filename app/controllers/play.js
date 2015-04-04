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
			rand_movie_id = this.getRandomMovieID(this.previous_movie_id),
			rand_actor_id = this.getRandomActorID();

		// TODO: list des couples passés pour éviter les répétitions
		// ne pas avoir deux fois le même film à la suite
		this.previous_movie_id = rand_movie_id;
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
		// Le 2ème film choisi doit être différent du 1er 
		var new_movie_id = this.getRandomMovieID(m_id),
			movie = this.getMovie(m_id),
			new_movie = this.getMovie(new_movie_id),
			actor = new_movie.cast[a_id];

		// Dans le cas ou l'acteur est présent dans les 2 films
		if (movie.cast.findBy('id', actor.id)) {
			a_id = this.getRandomActorID(a_id);
			actor = new_movie.cast[a_id];
		}
		return {
			movie: this.url_images + movie.poster_path,
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

	getRandomMovieID: function(forbidden_id) {
		var n = Math.floor(Math.random() * this.NB_MOVIES);
		//var n = Math.floor(Math.random() * (this.get('model').length));
		while (n === forbidden_id) {
			n = Math.floor(Math.random() * this.NB_MOVIES);
			//n = Math.floor(Math.random() * (this.get('model').length));
		}
		return n;
	},

	getRandomActorID: function(forbidden_id) {
		var n = Math.floor(Math.random() * this.NB_ACTORS);
		while (n === forbidden_id) {
			n = Math.floor(Math.random() * this.NB_ACTORS);
		}
		return n;
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

			/*         console.log(this.rand_tab[this.current_index]);*/

			//var res = this.rand_tab[this.current_index-1];
			//if (bool !== res) {
			//Ember.Logger.log('Game Over');
			//return;
			/*}*/
			this.incrementProperty('current_index');
		}
	}
});
