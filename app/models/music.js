import DS from 'ember-data';

export default DS.Model.extend({
	// Song data
	album: DS.attr('string'),
	artist: DS.attr('string'),
	createdAt: DS.attr('date'),
	image: DS.attr('string'),
	review: DS.attr('string'),
	title: DS.attr('string'),
	totalPlays: DS.attr('number'),
	type: DS.attr('string'),
	video: DS.attr('boolean'),
	year: DS.attr('number'),
	
	// Link data
	albumLink: DS.attr('string'),
	soundCloudLink: DS.attr('string'),
	spotifyLink: DS.attr('string'),
	youTubeLink: DS.attr('string'),
	
	// User data
	submittedBy: DS.attr('string'),
	submittedByID: DS.attr('string'),
	
	// HasMany data
	comments: DS.hasMany('comment', { async: true }),
	tags: DS.hasMany('tag', { async: true }),
	
	// Computed properties
	hasVideo: function () {
		if (this.get('type') && this.get('type') !== 'Song')
			return true;
		return this.get('video');
	}.property('type', 'video'),

	linkType: function () {
		if (this.get('spotifyLink')) return 'spotify';
		else if (this.get('youTubeLink')) return 'youtube';
		else if (this.get('soundCloudLink')) return 'soundcloud';
		else return false;
	}.property('spotifyLink', 'soundCloudLink', 'youTubeLink'),

	parsedYouTubeLink: function () {
		var link = this.get('youTubeLink');
		if (link) {
			if (link.length < 15)
				return link;
			return link.split('=')[1];
		}
	}.property('youTubeLink'),

	primaryLink: function () {
		if (this.get('linkType') === 'spotify') return this.get('spotifyLink');
		else if (this.get('linkType') === 'youtube') return this.get('youTubeLink');
		else if (this.get('linkType') === 'soundcloud') return this.get('soundCloudLink');
		else return false;
	}.property('linkType'),

	spotifyId: function () {
		if (this.get('spotifyLink'))
			return this.get('spotifyLink').split(':')[2];
	}.property('spotifyLink'),

	updatedAt: function () {
		return this.get('comments').map(function(comment){
			return comment.get('createdAt');
		})
		.sort()
		.objectAt(0);
	}.property('comments.[]'),

	returnPlayPayload: function (type, musicSource) {
		var source = this.returnPreferredLink(musicSource);
		return {
			link: source.link,
			albumLink: this.get('albumLink'),
			linkType: source.type, 
			title: this.get('title'), 
			artist: this.get('artist'), 
			identity: this.get('id'),
			isAlbum: type === 'album'
        };
	},

	returnPreferredLink: function (source) {
		if (source === 'spotify' && this.get('spotifyLink'))
			return {link: this.get('spotifyLink'), type: 'spotify'};
		if (source === 'youtube' && this.get('youTubeLink'))
			return {link: this.get('parsedYouTubeLink'), type: 'youtube'};
		return {link: this.get('primaryLink'), type: this.get('linkType')};
	}
});
