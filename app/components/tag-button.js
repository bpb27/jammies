import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['tag-component'],
	tagText: '',

	actions: {
    	
    	submitTag: function() {
    		this.sendAction('submitTag', this.get('tagText'));
    		this.set('tagText', '');
    	}
	
	}
});
