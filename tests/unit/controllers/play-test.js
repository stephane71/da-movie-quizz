import {
	moduleFor,
	test
}
from 'ember-qunit';

moduleFor('controller:play', {
	// Specify the other units that are required for this test.
	// needs: ['controller:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
	var controller = this.subject();
	assert.ok(controller);
});

test('Each Movie should have X actors', function(assert) {
	var controller = this.subject();

	controller.set('NB_MOVIES', 20);
	assert.ok(controller.getRandomMovieID()<20 , true);
});
