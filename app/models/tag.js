import DS from 'ember-data';

//DS.PromiseObject will resolve on template, value accessed through tag.tally.content

export default DS.Model.extend({
	name: DS.attr('string'),
	music: DS.hasMany('music', { async: true }),
	tally: function () {
	  	return DS.PromiseObject.create({
	    	promise: this.get('music').then(function(attribute){
	      		return attribute.get('length');
	    	})
	  	});
	}.property('music.length')
});
