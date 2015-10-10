import Ember from 'ember';

export default Ember.Controller.extend({
	currentUser: Ember.computed.alias('session.currentUser'),
	modelTrigger: false,
	query: '',
	playAllLinks: '',
	showOnlyFavorites: false,
	showOnlyVideos: false,
	songLimit: 39,
	sortAscending: true,
	sortProperties: ['createdAt'],
   userProfiles: Ember.inject.service(),

   _setup: function () {
      this.get('userProfiles.user'); //necessary to trigger fetchUser, which returns a promise
   }.on('init'),

   setMusicColumns: function (music) {
      var one = [];
      var two = [];
      var three = [];

      for (var i = 0; i < music.length; i++) {
         if (one.length === two.length && one.length === three.length) 
            one.push(music[i]);
         else if (one.length > two.length) 
            two.push(music[i]);
         else 
            three.push(music[i]);
      }

      return [one, two, three];

   },

	filteredContent: function () {
    	var music = this.get('model');
    	var query = Ember.String.htmlSafe(this.get('query')).string;
    	var rx = new RegExp(query, 'gi');
      var songs = music.filter(function(song) {
         if (this.showOnlyMatch(song))
            return this.queryMatch(song, rx);   
      }.bind(this));

      songs = this.sortAndLimitModel(songs);
      songs = this.setMusicColumns(songs);

      return songs;

  	}.property('model.isUpdating', 'query', 'sortProperties.[]', 'sortAscending', 'showOnlyFavorites', 'showOnlyVideos'),

  	queryMatch: function (song, rx) {
  		if (this.validModel(song)) {
  			return (song.get('title').match(rx) 
	      		|| song.get('artist').match(rx) 
	      		|| song.get('album').match(rx) 
	      		|| song.get('submittedBy').match(rx) 
	      		|| song.get('year').toString().match(rx));
  		}    	
  	},

   showOnlyMatch: function (song) {
      if (this.get('showOnlyVideos') && !song.get('hasVideo')) 
         return;
      if (this.get('showOnlyFavorites') && this.get('userProfiles.user.favorites').indexOf(song.get('id')) === -1) 
         return;

      return true;

   },

  	sortAndLimitModel: function (model) {
  		model = model.sortBy(this.get('sortProperties')[0]);

  		if (this.get('sortAscending'))
  			model.reverse();

  		return model.slice(0, this.get('songLimit'));
  		
  	},

  	validModel: function (model) {
      if (model.get('title') 
  			&& model.get('artist') 
  			&& model.get('album') 
  			&& model.get('submittedBy') 
  			&& model.get('year'))
  			return true;
  	},

  	actions: {
  		showOnly: function (property) {
         if (this.get(property))
            this.set(property, false);
         else
            this.set(property, true);
         this.set(property === 'showOnlyFavorites' ? 'showOnlyVideos' : 'showOnlyFavorites', false);
      },

      sortBy: function (property) {
  			if (this.get('sortProperties')[0] === property)
  				this.set('sortAscending', !this.get('sortAscending'));
  			else
  				this.set('sortProperties', [property]);
  		}
  	}

});
