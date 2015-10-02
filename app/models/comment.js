import DS from 'ember-data';

export default DS.Model.extend({
	comment: DS.attr('string'),
	postedBy: DS.attr('string'),
	submittedByID: DS.attr('string'),
	createdAt: DS.attr('date'),
	music: DS.hasMany('music', { async: true })
});
