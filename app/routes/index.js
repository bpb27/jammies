import Ember from 'ember';

export default Ember.Route.extend({
	model: function () {
		return this.store.findAll('user');
	},

	createNewUser: function (id, name) {
		var newUser = this.store.createRecord('user', {
			displayName: name,
			gId: id,
			lastVisit: new Date(),
			favorites: '',
			sourceDefault: 'spotify'
		});

		newUser.save().then(function (user) {
			console.log("New user " + name + " created.");
			this.get('userInformation').setUsers();
		}.bind(this));
	},

	findUser: function (id) {
		return this.get('context.content').filter(function(user){
			if (user['_data'] && user['_data']['gId'] === id) return true;
			if (user.get && user.get('gId') === id) return true;
		})[0];
	},

	processUser: function (id, name) {
		var user = this.findUser(id);
		if (!user)
				this.createNewUser(id, name);
	},

	actions: {
		signIn: function(provider) {
			this.get("session").open("firebase", { provider: provider}).then(function(data) {
				this.processUser(data.currentUser.id, data.currentUser.displayName);
			}.bind(this));
		}
	}
});
