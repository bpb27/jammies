import DS from 'ember-data';

export default DS.Model.extend({
	type: DS.attr('string'),
	title: DS.attr('string'),
	artist: DS.attr('string'),
	album: DS.attr('string'),
	year: DS.attr('number'),
	review: DS.attr('string'),
	youTubeLink: DS.attr('string'),
	spotifyLink: DS.attr('string'),
	soundCloudLink: DS.attr('string'),
	links: DS.attr('string'),
	linkType: DS.attr('string'),
	submittedBy: DS.attr('string'),
	submittedByEmail: DS.attr('string'),
	submittedByID: DS.attr('string'),
	createdAt: DS.attr('date'),
	comments: DS.hasMany('comment', { async: true }),
	tags: DS.hasMany('tag', { async: true }),
	totalPlays: DS.attr('number')
});
