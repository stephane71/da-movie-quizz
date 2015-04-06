import DS from 'ember-data';

export
default DS.Model.extend({
	name: DS.attr('string'),
	answers: DS.attr('number'),
	time: DS.attr('number'),
	score: DS.attr('number')
});
