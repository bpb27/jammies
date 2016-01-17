import Ember from 'ember';

export default Ember.Controller.extend({

	defaultImage: 'assets/images/vinylcover.jpg',
	error: null,
	formFields: [
		'album',
		'artist',
		'review',
		'soundcloud',
		'spotify',
		'title',
		'year',
		'youtube',
	],
	hasVideo: false,
	image: 'assets/images/vinylcover.jpg',

	clearForm: function () {
		this.get('formFields').forEach(function(field){
			this.set(field, '');
		}.bind(this));

		this.set('image', this.get('defaultImage'));
		this.set('hasVideo', false);
		this.set('albumLink', null);
	},

	determineSpotifyId: function (link) {
		if (!link)
			return link;
		if (link.indexOf('iframe') !== -1)
			return link.split(' ')[1].split('%')[2].replace('"', '');
		if (link.indexOf('http') !== -1)
			return link.split('/')[4];
		if (link.indexOf(':') !== -1)
			return link.split(':')[2];

		return link;
	},

	determineYoutubeId: function (link) {
		if (!link)
			return link;
		if (link.indexOf('=') !== -1)
			return link.split('=')[1];
		return link;
	},

	errorErase: function () {
		if (this.get('error'))
			Ember.run.later(function(){
				if (this && this.set && this.get('error'))
					this.set('error', null);
			}.bind(this), 5000);
	}.observes('error'),

	gatherFormData: function () {

		return {

			//Song data
			album: this.get('album'),
			artist: this.get('artist'),
			createdAt: new Date(),
			review: this.get('review'),
			image: this.get('image'),
			title: this.get('title'),
			totalPlays: 1,
			video: this.get('hasVideo'),
			year: this.get('year'),

			//Links
			albumLink: this.get('albumLink'),
			spotifyLink: this.get('spotify') ? 'spotify:track:' + this.determineSpotifyId(this.get('spotify')) : undefined,
			soundCloudLink: this.get('soundcloud'),
			youTubeLink: this.determineYoutubeId(this.get('youtube')),

			//User data
			submittedBy: this.get('session.currentUser.displayName'),
			submittedByID: this.get('userInformation.user')['id']

		};
	},

	saveRecord: function (data) {
		var song = this.store.createRecord('music', data);
		song.save().then(function(){
			this.clearForm();
			this.transitionToRoute('music');
		}.bind(this), function (error) {
			this.set('error', 'Failed to save song.');
			console.log("Error: ", error);
		}.bind(this));
	},

	determineSpotifyQuery: function () {
		if (this.get('youtube') && this.get('artist') && this.get('title')) {
			let obj = { base: "https://api.spotify.com/v1/search?q=", close: "&type=track" };
			obj['track'] = "track%3A" + this.get('title').replace(' ', '+');
			obj['artist'] = "+artist%3A" + this.get('artist').replace(' ', '+');
			return obj.base + obj.track + obj.artist + obj.close;
		}
	},

	// When you only have a youtube link
	querySpotify: function (path) {
		Ember.$.ajax(path).then(function(results){
			if (results && results.hasOwnProperty('tracks') && results.tracks.items) {
				var track = results.tracks.items[0];
				var spotifyData = {
					id: track.id,
					albumLink: track.album.uri,
					image: track.album.images[1]
				};
				console.log("Query spotify with this data", spotifyData);
			}
		}, function (error) {
			console.log(error);
		});
	},

	spotifyAPI: function () {

		if (this.get('spotify').length < 25)
			return;

		var spotId = this.determineSpotifyId(this.get('spotify'));

		Ember.$.ajax('https://api.spotify.com/v1/tracks/' + spotId).then(function(data){

			this.set('title', data.name);
			this.set('artist', data.artists[0].name);
			this.set('album', data.album.name);
			this.set('albumLink', data.album.uri);

			var images = data.album.images;

			if (images.findBy('height', 300))
				this.set('image', images.findBy('height', 300).url);
			else
				this.set('image', images[0].url);

			Ember.$('.col-md-3 img').attr('src', this.get('image'));

			Ember.$.ajax(data.album.href).then(function(album){
				var year = moment(album.release_date).format('YYYY');
				this.set('year', year);
			}.bind(this));

			Ember.$('textarea').focus();

		}.bind(this), function(error){
			console.log(error);
			this.set('error', 'Failed to load data from Spotify.');
		}.bind(this));

	}.observes('spotify'),

	validate: function (record) {
		var error = null;

		if (!record.spotifyLink && !record.youTubeLink && !record.soundCloudLink)
			error = 'Provide a song link, madam.';
		else if (!record.title || !record.artist)
			error = 'Title and artist, madam.';
		else if (!record.review)
			error = 'A review, madam.';
		else if (!record.year)
			error = 'A year, madam.';

		if (error)
			this.set('error', error);
		else
			return true;
	},

	actions: {

		submit: function () {
			if (!this.get('userInformation.user'))
				return this.set('error', 'Please sign in to submit a song.');

			// if (this.get('youtube') && !this.get('spotify')) {
			// 	var query = this.determineSpotifyQuery();
			// 	if (query) {
			// 		this.querySpotify(query)
			// 	}
			// }

			var form = this.gatherFormData();
			if (this.validate(form))
				this.saveRecord(form);
		},

		discard: function () {
			this.clearForm();
			this.transitionToRoute('music');
		}
	}


});
