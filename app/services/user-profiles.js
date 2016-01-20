import Ember from 'ember';

export default Ember.Service.extend({

	store: Ember.inject.service(),
	session: Ember.inject.service(),
	attempts: 0,
	users: undefined,
	user: undefined,

	_setup: function () {
		this.getUsers();
  }.on('init'),

	getUsers: function () {
		Ember.RSVP
			.resolve(this.get('store').query('user', {}))
			.then(function(users){
				if (this.ensureUsersAreLoaded(users)) {
					console.log("Users loaded.");
					this.set('users', users);
				}
	      else {
	        console.log("Loading users again.");
					this.incrementProperty('attempts');
					if (this.get('attempts') <= 3)
	        	Ember.run.later(this.getUsers.bind(this), 2000);
	      }
	    }.bind(this));
	},

  ensureUsersAreLoaded: function (users) {
    if (users && users.get && users.isLoaded)
      if (Array.isArray(users.get('content')) && users.get('content').length > 1)
        return true;
  },

	findUser: function () {
		var gId = this.get('session.currentUser.id');
		var users = this.get('users');
		var store = this.get('store');

		if (!gId || !users)
			return;

		var internalUserModel = users.get('content').filter(function(user_model){
			return user_model['_data']['gId'] === gId;
		})[0];

		if (internalUserModel) {
			Ember.RSVP
				.resolve(store.find('user', internalUserModel.id))
				.then(function(user){
					console.log(user.get('displayName') + ' has signed in.');
					this.set('user', user);

					if (user.set && user.save) {
						user.set('lastVisit', new Date());
						user.save();
					}

				}.bind(this));
		}

	}.observes('users', 'session.currentUser'),

	fetchUserProperty: function (property) {
		return this.get('user') ? this.get('user').get(property) : null;
	}

});
