import Ember from 'ember';

export default Ember.Controller.extend({
	spotify: function () {
		return this.get('model.sourceDefault') === 'spotify';
	}.property('model.sourceDefault'),

	youtube: Ember.computed.not('spotify'),

	actions: {
		changeSourceDefault: function (choice) {
			this.set('model.sourceDefault', choice);
			this.get('model').save();
		}
	}
});
