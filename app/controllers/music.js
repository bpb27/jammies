import Ember from 'ember';

export default Ember.Controller.extend({
	currentUser: Ember.computed.alias('session.currentUser'),
	modelTrigger: false,
	query: '',
	playAllLinks: '',
	showOnlyFavorites: false,
	showOnlyVideos: false,
	songLimit: 25,
	sortAscending: true,
	sortProperties: ['createdAt'],

	filteredContent: function () {

    	var music = this.get('model');
    	var query = Ember.String.htmlSafe(this.get('query')).string;
    	var rx = new RegExp(query, 'gi');
      var songs = music.filter(function(song) {
         return this.queryMatch(song, rx);   
      }.bind(this));

      return this.sortAndLimitModel(songs);

  	}.property('model.isUpdating', 'query', 'sortProperties.[]', 'sortAscending'),

  	queryMatch: function (song, rx) {
  		if (this.validModel(song)) {
  			return (song.get('title').match(rx) 
	      		|| song.get('artist').match(rx) 
	      		|| song.get('album').match(rx) 
	      		|| song.get('submittedBy').match(rx) 
	      		|| song.get('year').toString().match(rx) 
	      		|| song.get('type').toString().match(rx));
  		}    	
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
  			&& model.get('year') 
  			&& model.get('type'))
  			return true;
  	},

  	actions: {
  		sortBy: function (property) {
  			if (this.get('sortProperties')[0] === property)
  				this.set('sortAscending', !this.get('sortAscending'));
  			else
  				this.set('sortProperties', [property]);
  		}
  	}

});
