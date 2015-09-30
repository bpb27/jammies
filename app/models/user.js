import DS from 'ember-data';
//import Ember from 'ember';

export default DS.Model.extend({
	firstName: DS.attr('string'),
	lastName: DS.attr('string'),
	displayName: DS.attr('string'),
	email: DS.attr('string'),
	lastVisit: DS.attr('date'),
	favorites: DS.attr('string'),
	bans: DS.attr('string'),
	follows: DS.attr('string'),
	gString: DS.attr('string'),
	following: function () {
		return this.get('id') + ',' + this.get('follows');
	}.property('follows'),
	name: function () {
		return this.get('firstName') + ' ' + this.get('lastName');
	}.property('firstName', 'lastName')
});
