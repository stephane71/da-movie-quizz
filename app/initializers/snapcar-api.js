export function initialize( container, application ) {
	application.inject('route', 'snapcar-api', 'service:snapcar-api');
}

export default {
  name: 'snapcar-api',
  initialize: initialize
};
