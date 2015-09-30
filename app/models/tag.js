import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	music: DS.hasMany('music'),
	tally: function () {
		if (this.get('music'))
			return this.get('music').length.toString();
		return '0';
	}.property('music.length')
});
