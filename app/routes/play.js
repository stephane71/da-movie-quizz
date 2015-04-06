import Ember from 'ember';
import MovieAPI from '../mixins/movie-api';

export
default Ember.Route.extend(MovieAPI, {
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

		controller.initGameConditions();
		controller.set('model', model);
	},

	/*
	 * Model = liste des films les plus populaire
	 * une page = 20 films
	 * */
	model: function() {
		var self = this;
		return this.ajax(this.buildURL(null, {
				page: this.page
			}))
			.then(function(data) {
				return data.results;
			}).then(self.getMoviesCastPromise.bind(this));
	},

	actions: {
		refreshModel: function() {
			this.page++;
			this.refresh();
		}
	}
});
