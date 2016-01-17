import Ember from 'ember';

export default Ember.Controller.extend({

  error: '',

  validModel: function () {
    var model = this.get('model');
    var spotify = model.get('spotifyLink');
    var youtube = model.get('youTubeLink');
    var soundcloud = model.get('soundCloudLink');

    if (!model.get('title') || !model.get('artist') || !model.get('album') || !model.get('year') || !model.get('review'))
      return 'Title, artist, album, year, and a review are all required.';

    if (spotify) {
      if ((spotify.indexOf('spotify:track:') !== 0) || spotify.length !== 36)
        return 'Spotify link is incorrect.';
    }

    if (youtube) {
      if (youtube.length !== 11)
        return 'Youtube link is incorrect.';
    }

    if (soundcloud) {
      if (soundcloud.indexOf('http') === -1) {
        return 'Soundcloud link is incorrect.';
      }
    }

  },

  actions: {
    discard: function () {
      this.set('error', '');
      this.transitionToRoute('music');
    },

    submit: function () {

      this.set('error', '');
      var error = this.validModel();

      if (!error) {
        this.get('model').save().then(function(){
          this.transitionToRoute('music');
        }.bind(this), function (error) {
          this.set('error', error);
        });
      }
      else {
        this.set('error', error);
      }
    }
  }
});
