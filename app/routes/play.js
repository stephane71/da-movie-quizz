import Ember from 'ember';

export
default Ember.Route.extend({
	page: 1,

	setupController: function(controller, model) {
		var rand = [],
			l = model.length;
		for (var i = 0; i < l * 10; i++) {
			rand.push(Math.random() >= 0.5);
		}
		// rand_tab => liste de réponses Vrai/Faux
		controller.rand_tab = rand;
		controller.set('NB_ACTORS', this.get('movie-service').NB_ACTORS);
		controller.set('NB_MOVIES', model.length);

		controller.initGameConditions();
		controller.set('model', model);
	},

	/*
	 * Model = liste des films les plus populaire
	 * une page = 20 films
	 * */
	model: function() {
		var movie_service = this.get('movie-service'),
			url = movie_service.buildURL(null, {
				page: this.page
			});

		return movie_service.ajax(url)
			.then(function(data) {
				return data.results;
			})
			.then(movie_service.getMoviesCastPromises.bind(movie_service));
	},

	actions: {
		refreshModel: function(game_over) {
			if (!game_over) {
				this.page++;
			}
			this.refresh();
		}
	}
});
