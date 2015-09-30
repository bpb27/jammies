import DS from 'ember-data';
//import Ember from 'ember';

export default DS.Model.extend({
	displayName: DS.attr('string'),
	lastVisit: DS.attr('date'),
	favorites: DS.attr('string'),
	gId: DS.attr('string')
});
