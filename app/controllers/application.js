import Ember from 'ember';

export default Ember.Controller.extend({
  	isPlaying: false,
	playType: '',

  	actions: {
  		closePlayer: function () {
			this.set('isPlaying', false);
			Ember.$('.audio-player').html('');
		},

  		playRequest: function (request) {
  			this.send('closePlayer');
			
			Ember.run.next(function(){
				this.set('isPlaying', true);
				this.set('playType', request.linkType)
				Ember.$('.audio-player').append(request.embedLink);
			}.bind(this));
  		}
  	}
});
