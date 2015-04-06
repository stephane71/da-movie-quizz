import Ember from 'ember';
import MovieApiMixin from '../../../mixins/movie-api';
import { module, test } from 'qunit';

module('MovieApiMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var MovieApiObject = Ember.Object.extend(MovieApiMixin);
  var subject = MovieApiObject.create();
  assert.ok(subject);
});
