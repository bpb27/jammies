import Ember from 'ember';

export default Ember.Route.extend({
	model () {
		return this.store.findAll('music');
	}

	// model () {
	// 	return this.store.findAll('music').then(function(music){
	// 		return music;
	// 	});
	// },
	// afterModel (model, transition) {
	// 	return Ember.RSVP.all(model.getEach('comments').then(function(){
	// 		return model;
	// 	}));
	// }
	// model () {
	// 	return Ember.RSVP.hash({
	// 		songs: this.store.findAll('music'),
	// 		comments: this.store.findAll('comment')
	//     }).then(function(results){
	//     	console.log(results);
	//     	return results.songs;
	//     });
	// }
});
