import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['music-entry-component'],
	isPlayingVideo: false,
	isShowingAlbum: false,
	isShowingComments: false,
	isShowingTagForm: false,
	newComment: '',

	addTagText: function () {
		return this.get('uniqueTags.length') ? '' : 'Tag';
	}.property(),

	imageToDisplay: function () {
		return this.get('song.image') || 'assets/images/vinylcover_sm.jpg';
	}.property(),

	isCreator: function () {
		if (this.get('userInformationAvailable'))
			return this.get('song.submittedByID') === this.get('userInformation').fetchUserProperty('id');
	}.property(),

	isBanned: function () {
		return false;
	}.property(),

	isFavorite: function () {
		if (this.get('userInformationAvailable')) {
			var favorites = this.get('userInformation').fetchUserProperty('favorites');
			if (favorites)
				return ~favorites.indexOf(this.get('song.id'));
		}
	}.property(),

	tagCollection: function () {
		return this.get('tagList').map(function(tag){
			return tag.name;
		});
	}.property('tagList.length'),

	uniqueComments: function () {
		return this.get('song.comments').uniq();
	}.property('song.comments.length'),

	uniqueTags: function () {
		return this.get('song.tags').uniq();
	}.property('song.tags.length'),

	userInformationAvailable: function () {
		return this.get('userInformation') && this.get('userInformation').fetchUserProperty;
	}.property('userInformation'),

	actions: {

		deleteComment: function (commentId) {
			this.sendAction('deleteComment', commentId, this.get('song.id'));
		},

		discardComment: function () {
			this.set('newComment', '');
			this.set('isShowingComments', false);
		},

		edit: function () {
			this.sendAction('edit', this.get('song.id'));
		},

		favorite: function (isFavorite) {
			this.sendAction('favorite', this.get('song.id'));
			this.set('isFavorite', isFavorite);
		},

		play: function (type) {
			if (type === 'album' && !this.get('song.albumLink'))
				return;
			this.sendAction('loadPlayer', this.get('song'), type);
		},

		searchText: function (name) {
			this.sendAction('searchText', name);
		},

		showComments: function () {
			this.set('isShowingComments', !this.get('isShowingComments'));
		},

		submitComment: function () {
			this.sendAction('submitComment', this.get('newComment'), this.get('song.id'));
			this.send('discardComment');
		},

		submitTag: function (tag) {
			this.sendAction('submitTag', tag, this.get('song.id'));
		},

		showTagForm: function () {
			this.set('isShowingTagForm', !this.get('isShowingTagForm'));
		}
	}
});
