import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll('user');
	},

	findExistingUser: function (name, id) {
		try {
			
			var userIdToUpdate;
			
			this.get('context.content').forEach(function(user){
				if (name.indexOf(user['_data']['firstName']) !== -1) {
					userIdToUpdate = user['id'];
				}
				else if (name.indexOf(user['_data']['lastName']) !== -1 && user['_data']['lastName'] !== 'Brown') {
					userIdToUpdate = user['id'];
				}
			});

			if (userIdToUpdate) {
				this.store.findRecord('user', userIdToUpdate).then(function(model){
					model.set('gId', id);
					model.set('displayName', name);
					model.save().then(function(results){
						console.log("Success", results);
					});
				});
			} 
			else {
				//createUser
			}

		} catch (e) {
			console.log("Unable to find user.", e);
		}
	},

	actions: {
    	signIn: function(provider) {
			this.get("session").open("firebase", { provider: provider}).then(function(data) {
				console.log(data.currentUser);
				this.findExistingUser(data.currentUser.displayName, data.currentUser.id);
			}.bind(this));
    	}
  	}
});
