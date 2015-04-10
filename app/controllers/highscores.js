import Ember from 'ember';

export default Ember.ArrayController.extend({
	sortProperties: ['score', 'time'],
	sortAscending: false
});
