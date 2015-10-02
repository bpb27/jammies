import Ember from 'ember';

export default Ember.Service.extend({

	store: Ember.inject.service(),

	users: [],

	_setup: function () {
		this.fetchUsers().then(function(users){
			this.set('users', users);
		}.bind(this));
	}.on('init'),

	user: function () {
		return this.get('users').findBy('gId', this.get('session.currentUser.id'));
	}.property('users.length'),

	fetchUsers: function () {
		return this.get('store').findAll('user').then(function(users){
			return users;
		});
	}
});
