export
function initialize(container, application) {
	application.inject('route', 'movie-service', 'service:movie-service');
}

export
default {
	name: 'movie-service',
	initialize: initialize
};
