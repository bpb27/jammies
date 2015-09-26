import Ember from 'ember';

export default Ember.Controller.extend({
	logger: function () {
		console.log(this, this.get('session'));
	}.on('init')
});
