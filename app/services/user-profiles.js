import Ember from 'ember';

export default Ember.Service.extend({

	store: Ember.inject.service(),
	session: Ember.inject.service(),

	setUsers: function () {
		this.fetchUsers().then(function(users){
			this.set('users', users);
		}.bind(this));
	}.on('init'),

	fetchUser: function () {
		if (this.get('session.currentUser.id'))
			return this.get('users').findBy('gId', this.get('session.currentUser.id'));
	},

	fetchUserProperty: function (property) {
		var userModel = this.fetchUser();
		if (userModel && userModel.get)
			return userModel.get(property);
	},

	fetchUsers: function () {
		return this.get('store').findAll('user').then(function(users){
			return users;
		});
	}
});
