import Ember from 'ember';

export
default Ember.View.extend({
	didInsertElement: function() {
		var current = this.get('controller.tuple');
		this.appendTupleImages(this.getTupleImages(current));
		// En incrémentant cet index on génère un nouveau tuple 
		// et les images sont chargées
		this.get('controller').incrementProperty('current_index');
	},

	appendTupleImages: function(tuple) {
		Ember.$('#div_img').html('');
		Ember.$('#div_img').append(tuple.movie);
		Ember.$('#div_img').append(tuple.actor);
	},

	getTupleImages: function(tuple) {
		var movie_img = new Image();
		movie_img.src = tuple.movie;
		var actor_img = new Image();
		actor_img.src = tuple.actor;
		return {
			movie: movie_img,
			actor: actor_img
		};
	},

	/*
	 * Lorsqu'un nouveau tuple est créé,
	 * 		=> on remplace les images actuel par les courrante
	 * 		=> on download les futurs images
	 * */
	onTupleChange: function() {
		if (this.next) {
			this.appendTupleImages(this.next);
		}
		this.next = this.getTupleImages(this.get('controller.tuple'));
	}.observes('controller.tuple'),
});
