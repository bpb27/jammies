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
		return false;
	}.property(),

	isBanned: function () {
		return false;
	}.property(),

	isFavorite: function () {
		return false;
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

	actions: {

		deleteComment: function (commentId) {
			this.sendAction('deleteComment', commentId, this.get('song.id'));
		},

		discardComment: function () {
			this.set('newComment', '');
			this.set('isShowingComments', false);
		},

		favorite: function (type) {
			this.sendAction('favorite', this.get('song.id'), type);
		},

		play: function (type) {			
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
