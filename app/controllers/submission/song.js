import Ember from 'ember';

export default Ember.Controller.extend({
	selectedType: 'Song',
	types: ['Song', 'Live Performance', 'Music Video'],

	clearForm: function () {
		var fields = ['album', 'artist', 'comment', 'image', 'title', 'selectedType', 'year', 'spotify', 'youtube', 'soundcloud'];
		fields.forEach(function(field){
			this.set(field, '');
		}.bind(this));
	},

	determineSpotifyLink: function () {
		var spotId = '';
		var spotLink = this.get('spotify');

		if (spotLink.indexOf('http') !== -1) {
			spotId = spotLink.split('/')[4];
		} else if (spotLink.indexOf(':') !== -1) {
			spotId = spotLink.split(':')[2];
		} else {
			spotId = spotLink;
		}

		this.set('spotifyLink', spotId);
		return spotId;
	},

	gatherFormData: function () {

		return {
			
			//Song data
			album: this.get('album'),
			artist: this.get('artist'),
			createdAt: new Date(),
			comment: this.get('comment'),
			image: this.get('image'),
			title: this.get('title'),
			totalPlays: 1,
			type: this.get('selectedType'),
			year: this.get('year'),
			
			//Links
			albumLink: this.get('albumLink'),
			spotifyLink: this.get('spotify'),
			soundCloudLink: this.get('soundcloud'),
			youTubeLink: this.get('youtube'),

			//User data
			submittedBy: this.get('session.currentUser.displayName'),
			//submittedByEmail: this.get('session.userProfile.email'),
			//submittedByID: this.get('session.userProfile.id')
		
		};
	},

	saveRecord: function (data) {
		var song = this.store.createRecord('music', data);
		song.save().then(function(){
			this.clearForm();
			this.transitionToRoute('songs');
		}.bind(this));
	},

	spotifyAPI: function () {

		if (this.get('spotify').length < 25) return;
		var spotId = this.determineSpotifyLink();

		Ember.$.ajax('https://api.spotify.com/v1/tracks/' + spotId).then(function(data){
			
			console.log(data);
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

		}.bind(this), function(error){
			console.log(error);
		});
			
	}.observes('spotify'),

	validate: function (record) {
		if (!record.spotifyLink && !record.youTubeLink && !record.soundCloudLink) 
			return alert('A link, madam.');
		if (!record.title || !record.artist) 
			return alert('Title and artist, madam.');
		if (!record.comment) 
			return alert('Your review sir, if even just a word.');
		return true;
	},

	actions: {
		
		submit: function () {
			var form = this.gatherFormData();
			if (this.validate(form))
				this.saveRecord(form);
		},
		
		discard: function () {
			this.clearForm();
			this.transitionToRoute('songs');
		}
	}


});
