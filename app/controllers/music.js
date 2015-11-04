import Ember from 'ember';

//model.songs & model.tags

export default Ember.Controller.extend({
	currentUser: Ember.computed.alias('session.currentUser'),
	error: '',
   numberOfColumns: 3,
	query: '',
	playAllLinks: '',
	showOnlyFavorites: false,
	showOnlyVideos: false,
	songLimit: 27,
	sortAscending: true,
	sortProperties: ['createdAt'],
   artistSort: 'name',
   tagSort: 'tally',

   _setup: function () {
      Ember.run.later(function() {
         this.set('tagSort', 'name'); // tally is promise that doesn't render the first time...
      }.bind(this), 4000);
   }.on('init'),

   aristList: function () {
      var hash = {};
      
      this.get('model.songs').forEach(function(song){
         var artist = song.get('artist');
         if (hash[artist])
            hash[artist] = hash[artist] + 1;
         else
            hash[artist] = 1;
      });
      
      var list = Object.keys(hash).map(function(name){
         return {
            name: name,
            tally: hash[name]
         }
      })
      .sortBy(this.get('artistSort'));

      if (this.get('artistSort') === 'tally')
         return list.reverse();
      return list;

   }.property('model.songs.isUpdating', 'model.songs.length', 'artistSort'),

   tagList: function () {
      var list = this.get('model.tags').map(function(tag){
         return {
            name: tag.get('name'),
            tally: tag.get('tally.content')
         }
      })
      .uniq()
      .sortBy(this.get('tagSort'));

      if (this.get('tagSort') === 'tally')
         return list.reverse();
      return list;
   
   }.property('model.tags.isUpdating', 'model.tags.length', 'tagSort'),

	filteredContent: function () {
    	var music = this.get('model.songs');
    	var query = Ember.String.htmlSafe(this.get('query')).string;
    	var rx = new RegExp(query, 'gi');
      var songs = music.filter(function(song) {
         if (this.showOnlyMatch(song))
            return this.queryMatch(song, rx);   
      }.bind(this));

      songs = this.sortAndLimitModel(songs);
      this.gatherPlayAllLinks(songs);
      songs = this.setMusicColumns(songs); //deal with small browser width

      return songs;

  	}.property('model.songs.isUpdating', 'query', 'sortProperties.[]', 'sortAscending', 'showOnlyFavorites', 'showOnlyVideos'),

  	gatherPlayAllLinks: function (music) {
      var all = 'spotify:trackset:All Jams:';
      var links = music.map(function(entry){
         if (entry.get('spotifyLink'))
            return entry.get('spotifyLink').split(':')[2] + ','
      }).join('');
      
      all = all + links;
      this.set('playAllLinks', all);
   },

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

   getSongTags: function (song) {
      if (!song.get('tags'))
         return '';
      
      return song.get('tags').map(function(tag){
         return tag.get('name')
      }).join();
   },

   queryMatch: function (song, rx) {
  		if (this.validModel(song)) {
         return (song.get('title').match(rx) 
	      		|| song.get('artist').match(rx) 
	      		|| song.get('album').match(rx) 
	      		|| song.get('submittedBy').match(rx) 
	      		|| song.get('year').toString().match(rx)
               || this.getSongTags(song).match(rx)); //make tag searches exact
  		}    	
  	},

   scrollUp: function () {
      Ember.$("html, body").animate({ scrollTop: 0 }, "fast");
   },

   setMusicColumns: function (music) {
      var one = [];
      var two = [];
      var three = [];
      var four = [];

      if (this.get('numberOfColumns') === 3) {
         for (var i = 0; i < music.length; i++) {
            if (one.length === three.length) 
               one.push(music[i]);
            else if (one.length > two.length) 
               two.push(music[i]);
            else 
               three.push(music[i]);
         }
         return [one, two, three];
      }

      if (this.get('numberOfColumns') === 4) {
         for (var i = 0; i < music.length; i++) {
            if (one.length === four.length) 
               one.push(music[i]);
            else if (one.length > two.length)
               two.push(music[i]);
            else if (two.length > three.length) 
               three.push(music[i]);
            else 
               four.push(music[i]);
         }
         return [one, two, three, four];
      }

   },

   showOnlyMatch: function (song) {
      if (this.get('showOnlyVideos') && !song.get('hasVideo')) 
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
      closeVideo: function () {
         Ember.$('.video-player-container .video-player').html('');
         Ember.$('.video-player-container').removeClass('playing');
      },

      loadPlayer: function (song, type) {

         if (type === 'video')
            return this.send('playVideo', song);
         
         var defaultSource = this.get('userInformation').fetchUserProperty('sourceDefault');
         var playPayload = song.returnPlayPayload(type, defaultSource);
         
         playPayload = this.determineEmbedFrame(playPayload);
         song.set('totalPlays', song.get('totalPlays') + 1);
         song.save();
         this.container.lookup('controller:application').send('playRequest', playPayload);

      },

      playAll: function () {
         var playPayload = this.determineEmbedFrame({
            albumLink: this.get('playAllLinks'),
            linkType: 'spotify',
            isAlbum: true
         });
         
         this.container.lookup('controller:application').send('playRequest', playPayload);
      },

      playVideo: function (song) {
         var embed = '<iframe width="640" height="390" src="https://www.youtube.com/embed/' + song.get('parsedYouTubeLink') + '" frameborder="0" allowfullscreen></iframe>';
         Ember.$('.video-player-container .video-player').html('');
         Ember.$('.video-player-container .video-player').append(embed);
         Ember.$('.video-player-container').addClass('playing');
         this.scrollUp();
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
  		},

      sortSidebar: function (field, sort) {
         this.set(field + 'Sort', sort);
      },

      submitComment: function (text, entryId) {
         
         var newComment = {
            comment: text,
            postedBy: this.get('currentUser.displayName'),
            submittedByID: this.get('userInformation').fetchUserProperty('id'), 
            createdAt: new Date(),
         }

         if (!newComment['comment'] || !newComment['postedBy'] || !newComment['submittedByID']) return; //handle error

         var comment = this.store.createRecord('comment', newComment);

         this.store.find('music', entryId).then(function(song){
            song.get('comments').pushObject(comment);
            song.save().then(function(){
               comment.save();
            });
         }.bind(this));

      },

      submitTag: function (text, entryId) {
         if (!text) 
            return; //also ensure auth

         var tag = this.get('model.tags').findBy('name', text.toLowerCase());
         
         if (!tag)
            tag = this.store.createRecord('tag', {name: text.toLowerCase()});

         this.store.find('music', entryId).then(function(song){
            song.get('tags').pushObject(tag);
            song.save().then(function(){
               tag.save();
            });
         }.bind(this));

      },
  	}

});
