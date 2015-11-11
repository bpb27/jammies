import Ember from 'ember';

export default Ember.Route.extend({
	model: function () {
		return this.store.findAll('user');
	},

	createNewUser: function (name, id) {
		var newUser = this.store.createRecord('user', {
			displayName: name,
			gId: id,
			lastVisit: new Date(),
			favorites: '',
			sourceDefault: 'spotify'
		});

		newUser.save();
	},

	locateExistingUser: function (name) {
		return this.get('context.content').filter(function(user){
			if (name.indexOf(user['_data']['firstName']) !== -1)
				return true;
			if (name.indexOf(user['_data']['lastName']) !== -1 && user['_data']['lastName'] !== 'Brown')
				return true;
		});
	},

	processUser: function (name, id) {
		var user = this.locateExistingUser(name)[0];
		var userIsUpdated = this.userIsUpdated(user);

		if (!userIsUpdated) {
			if (user)
				this.updateExistingUser(user, name, id);
			else if (name && id)
				this.createNewUser(name, id);
			else 
				console.log("Error");
		}
	},

	updateExistingUser: function (user, name, id) {
		this.store.findRecord('user', user['id']).then(function(model){
			model.set('gId', id);
			model.set('displayName', name);
			model.save();
		});
	},

	userIsUpdated: function (user) {
		if (user && user['_data'] && user['_data']['gId']) 
			return true;
	},

	actions: {
    	signIn: function(provider) {
			this.get("session").open("firebase", { provider: provider}).then(function(data) {
				this.processUser(data.currentUser.displayName, data.currentUser.id);
			}.bind(this));
    	}
  	}
});
