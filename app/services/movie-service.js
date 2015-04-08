import Ember from 'ember';

export
default Ember.Service.extend({
	key: 'afc3d90d2d302e68e3f870ad29c66634',
	url: 'https://api.themoviedb.org/3/',

	// Choix du nombre d'acteurs / film
	NB_ACTORS: 5,

	buildURL: function(type, param) {
		var url;
		if (type === 'cast') {
			url = this.url + 'movie/' + param.id_movie +
				'/credits?api_key=' + this.key;
		} else {
			url = this.url + 'movie/popular?api_key=' +
				this.key + '&page=' + param.page;
		}
		url += '&callback=?';
		return url;
	},

	ajax: function(url) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.$.ajax({
				url: url,
				type: 'GET',
				dataType: "jsonp",

				// This handler is not called for cross-domain script and cross-domain JSONP requests.
				// http://api.jquery.com/jquery.ajax/
				error: function(jqXHR, status, error) {
					Ember.run(null, reject, [jqXHR, status, error]);
				},

				success: function(data) {
					Ember.run(null, resolve, data);
				}
			});
		});
	},

	getMoviesCastPromises: function(movies) {
		var self = this;
		return Ember.RSVP.all(movies.map(function(m) {
			return self.getOneMovieCastPromises(m.id).then(function(cast) {
				return {
					backdrop_path: m.backdrop_path,
					poster_path: m.poster_path,
					cast: cast
				};
			});
		}));
	},

	/*
	 * Request the movie's cast
	 * return Promise and the first 5 actors of the movie
	 * */
	getOneMovieCastPromises: function(id_movie) {
		var nb_actors = this.NB_ACTORS;
		return this.ajax(this.buildURL('cast', {
				id_movie: id_movie
			}))
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
	}
});
