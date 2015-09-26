import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	music: DS.hasMany('music')
});
