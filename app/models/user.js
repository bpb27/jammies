import DS from 'ember-data';
//import Ember from 'ember';

export default DS.Model.extend({
	firstName: DS.attr('string'),
	lastName: DS.attr('string'),
	displayName: DS.attr('string'),
	lastVisit: DS.attr('date'),
	favorites: DS.attr('string'),
	gId: DS.attr('string'),
	sourceDefault: DS.attr('string')
});
