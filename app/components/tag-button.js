import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['tag-component'],
	tagText: '',

	suggestion: function () {
		var collection = this.get('tagCollection');
		var query = this.get('tagText');

		if (collection && query) {
			return collection.filter(function(item){
				return item.indexOf(query) === 0;
			})[0];
		}

	}.property('tagText'),

	actions: {
    	
    	submitTag: function() {
    		this.sendAction('submitTag', this.get('tagText'));
    		this.set('tagText', '');
    	},

    	substitute: function () {
    		this.set('tagText', this.get('suggestion'));
    	}
	
	}
});
