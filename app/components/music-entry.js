import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['music-entry-component'],
	isPlayingVideo: false,
	isShowingCommentForm: false,
	isShowingAlbum: false,

	imageToDisplay: function () {
		return this.get('song.image') || 'assets/images/vinylcover_sm.jpg';
	}.property(),

	isCreator: function () {
		return false;
	}.property(),

	isBanned: function () {
		return false;
	}.property(),

	isFavorite: function () {
		return false;
	}.property(),

	actions: {

		deleteComment: function (commentId) {
			this.sendAction('deleteComment', commentId, this.get('song.id'));
		},

		discardComment: function () {
			this.set('isShowingCommentForm', false);
		},

		edit: function () {
			console.log("Edit");
		},

		editComment: function () {
			this.set('isShowingCommentForm', true);
		},

		favorite: function (type) {
			this.sendAction('favorite', this.get('song.id'), type);
		},

		loadPlayer: function (type) {			
			this.sendAction('loadPlayer', this.get('song'), type);
		},

		playAlbum: function () {
			if (this.get('song.albumLink')) {
				this.set('isShowingAlbum', !this.get('isShowingAlbum'));

				if (this.get('isShowingAlbum'))
					this.send('loadPlayer', 'album');
			} 
		},

		playSong: function () {
			this.send('loadPlayer', 'song');
		},

		playVideo: function () {
			this.sendAction('playVideo', this.get('song.parsedYouTubeLink'));
		},

		searchTag: function (name) {
			this.sendAction('searchTag', name);
		},

		submitComment: function (param) {
			this.sendAction('submitComment', param, this.get('song.id'));
			this.send('discardComment');
		},

		submitTag: function (param) {
			this.sendAction('submitTag', param, this.get('song.id'));
		},

		showCommentForm: function () {
			this.set('isShowingCommentForm', !this.get('isShowingCommentForm'));
		},

		showTagForm: function () {
			this.set('isShowingTagForm', !this.get('isShowingTagForm'));
		}
	}
});
