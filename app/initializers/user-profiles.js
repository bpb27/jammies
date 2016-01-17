export function initialize(container, application) {
	application.inject('controller', 'userInformation', 'service:user-profiles');
	application.inject('component', 'userInformation', 'service:user-profiles');
	application.inject('route', 'userInformation', 'service:user-profiles');
}

export default {
  name: 'user-profiles',
  initialize: initialize
};
