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

	uniqueTags: function () {
		return this.get('song.tags')
			.map(function(tag){
				return tag.get('name');
			})
			.uniq()
			.map(function(tagName){
				return Ember.Object.create({name: tagName});
			});
	}.property('song.tags.length'),

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

		play: function (type) {			
			this.sendAction('loadPlayer', this.get('song'), type);
		},

		searchText: function (name) {
			this.sendAction('searchText', name);
		},

		submitComment: function (param) {
			this.sendAction('submitComment', param, this.get('song.id'));
			this.send('discardComment');
		},

		submitTag: function (tag) {
			this.sendAction('submitTag', tag, this.get('song.id'));
		},

		showCommentForm: function () {
			this.set('isShowingCommentForm', !this.get('isShowingCommentForm'));
		},

		showTagForm: function () {
			this.set('isShowingTagForm', !this.get('isShowingTagForm'));
		}
	}
});
