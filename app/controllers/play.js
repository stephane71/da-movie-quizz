import Ember from 'ember';

export
default Ember.Controller.extend({
	/* Revoir gestion de l'API */
	url_images: 'http://image.tmdb.org/t/p/w342/',

	nb_good_answers: 0,

	onMoviesListLoaded: function() {
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
			rand_movie_id = this.getRandomID(this.NB_MOVIES, this.previous_movie_id),
			rand_actor_id = this.getRandomID(this.NB_ACTORS);

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
		var actor = this.getActor(movie, a_id);
		return {
			movie: this.url_images + movie.poster_path,
			actor: this.url_images + actor.profile_path
		};
	},

	getWrongTuple: function(m_id, a_id) {
		// Le 2ème film choisi doit être différent du 1er 
		var new_movie_id = this.getRandomID(this.NB_MOVIES, m_id),
			movie = this.getMovie(m_id),
			new_movie = this.getMovie(new_movie_id),
			actor = this.getActor(new_movie, a_id);

		// Dans le cas ou l'acteur est présent dans les 2 films
		if (movie.cast.findBy('id', actor.id)) {
			a_id = this.getRandomID(this.NB_ACTORS, a_id);
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

	getActor: function(movie, id) {
		var actor = movie.cast[id];
		while (actor === undefined) {
			actor = movie.cast[this.getRandomID(this.NB_ACTORS)];
		}
		return actor;
	},

	getRandomID: function(N, forbidden_id) {
		var n = Math.floor(Math.random() * N);
		while (n === forbidden_id) {
			n = Math.floor(Math.random() * N);
		}
		return n;
	},

	/*
	 * Timer
	 * */
	seconds: 0,
	triggerTimer: function() {
		var self = this;
		this.set('seconds', 0);
		clearInterval(this.timer_int);
		this.timer_int = setInterval(function() {
			self.incrementProperty('seconds');
		}, 1000);
	},

	NB_HIGHSCORES: 10,
	/*
	 * Highscores
	 * On peu inscrire son score si:
	 * 		score != 0
	 * 		le score est > à un highscore
	 *
	 * */

	showRecordForm: function() {
		var self = this,
			score = this.get('nb_good_answers');

		// Si le score est null => pas d'enregistrement
		if (!score) {
			this.set('record_score', false);
			return;
		}
		this.store.find('highscore').then(function(data) {
			var show = false;

			//Il reste de la place dans les highscores
			if (data.toArray().length < self.NB_HIGHSCORES) {
				show = true;
			}
			//Est ce que le score est > à un highscore?
			else {
				var del = data.filter(function(e) {
					if (score <= e.get('score')) {
						return false;
					}
					return true;
				});
				// Si au moins un highscore < score
				if (del.toArray().length) {
					show = true;
				}
			}
			self.set('record_score', show);
		});
	}.observes('game_over'),

	initGameConditions: function() {
		if (this.get('game_over')) {
			this.set('game_over', false);
			this.set('nb_good_answers', 0);
			this.set('recorded_flag', false);
			this.triggerTimer();
		}
	},

	fixNbHighscores: function() {
		var hs = this.store.all('highscore');
		if (hs.get('length') > this.NB_HIGHSCORES) {
			var del = hs.sortBy('score').get('firstObject');
			del.destroyRecord();
		}
	},

	actions: {
		saveHighscore: function() {
			var self = this,
				highscore = this.get('nb_good_answers'),
				player_name = Ember.$('#player_name').val();

			var s = this.store.createRecord('highscore', {
				name: player_name,
				score: highscore,
				time: this.seconds
			});
			s.save().then(function() {
				self.set('recorded_flag', true);
				self.fixNbHighscores();
			});
		},

		onPlay: function() {
			this.set('init_game', true);
			this.triggerTimer();
		},

		playAgain: function() {
			this.set('init_game', true);
			this.send('refreshModel', true);
		},

		onSelection: function(bool) {
			var res = this.rand_tab[this.current_index - 1];
			if (bool !== res) {
				Ember.Logger.log('Game Over');
				this.set('game_over', true);
				clearInterval(this.timer_int);
				return;
			}
			this.incrementProperty('nb_good_answers');
			if (this.get('current_index') > this.NB_MOVIES) {
				this.send('refreshModel');
				return;
			}
			this.incrementProperty('current_index');
		}
	}
});
