import Ember from 'ember';

export default Ember.Route.extend({
	model () {
		return Ember.RSVP.hash({
			songs: this.store.findAll('music'),
			tags: this.store.findAll('tag')
	    }).then(function(results){
	    	return results;
	    });
	}
});
