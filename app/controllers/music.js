import Ember from 'ember';

export default Ember.Controller.extend({
	currentUser: Ember.computed.alias('session.currentUser'),
	error: '',
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

  	determineEmbedFrame: function (playPayload) {
      var frame = '';

      if (playPayload.isAlbum)
         frame = '<iframe src="https://embed.spotify.com/?uri=' + playPayload.albumLink + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>';
      else if (playPayload.linkType === 'spotify')
         frame = '<iframe id="iframe-player" src="https://embed.spotify.com/?uri=' + playPayload.link + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>';
      else if (playPayload.linkType === 'youtube')
         frame = '<iframe src="//www.youtube.com/embed/' + playPayload.link + '?autoplay=1" width="100%" height="32" frameborder="0" allowfullscreen></iframe>';
      else if (playPayload.linkType === 'soundcloud')
         frame = '<iframe id="iframe-player" width="100%" height="120" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' + playPayload.link + '&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';
      else
         this.set('error', 'Unable to play song due to broken link');

      playPayload['embedLink'] = frame;

      return playPayload;
   },

   queryMatch: function (song, rx) {
  		if (this.validModel(song)) {
  			return (song.get('title').match(rx) 
	      		|| song.get('artist').match(rx) 
	      		|| song.get('album').match(rx) 
	      		|| song.get('submittedBy').match(rx) 
	      		|| song.get('year').toString().match(rx));
  		}    	
  	},

   scrollUp: function () {
      Ember.$("html, body").animate({ scrollTop: 0 }, "slow");
   },

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
  			&& model.get('year')) // remove?
  			return true;
  	},

  	actions: {
      loadPlayer: function (song, type) {

         if (type === 'video') {
            console.log('Video play.');
         }
         else {
            var playPayload = {
               link: song.get('primaryLink'),
               albumLink: song.get('albumLink'),
               linkType: song.get('linkType'), 
               title: song.get('title'), 
               artist: song.get('artist'), 
               identity: song.get('id'),
               isAlbum: type === 'album'
            };
            
            playPayload = this.determineEmbedFrame(playPayload);
            this.container.lookup('controller:application').send('playRequest', playPayload);
            //increment play
         }

      },

  		searchText: function (text) {
         if (this.get('query') === text)
            this.set('query', '');
         else
            this.set('query', text);

         this.scrollUp();
      },

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
