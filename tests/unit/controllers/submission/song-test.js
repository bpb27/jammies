import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:submission/song', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it exists', function (assert) {
  var controller = this.subject();
  assert.ok(controller);
});

test('Spotify link parsed correctly', function (assert) {
	var controller = this.subject();
	
	var link = 'https://open.spotify.com/track/5OzHuTzS6K5mn8oQg7owRf';
	var uri = 'spotify:track:5OzHuTzS6K5mn8oQg7owRf';
	var embed = '<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%5OzHuTzS6K5mn8oQg7owRf" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
	var id = '5OzHuTzS6K5mn8oQg7owRf';

	assert.equal(controller.determineSpotifyLink(link), id);
	assert.equal(controller.determineSpotifyLink(uri), id);
	assert.equal(controller.determineSpotifyLink(embed), id);

});

test('Youtube link parsed correctly', function (assert) {
	var controller = this.subject();
	
	var link = 'https://www.youtube.com/watch?v=bw3S1dlsGzU';
	var id = 'bw3S1dlsGzU';

	assert.equal(controller.determineYoutubeLink(link), id);
	assert.equal(controller.determineYoutubeLink(id), id);

});

test('Gathers all form data and adds necessary properties', function (assert) {
	var controller = this.subject();
	var model;

	Ember.run(function(){
		setSession(controller);
		controller.setProperties(modelOne);
		controller.set('userInformation', {
			fetchUser: function () {
				return {id: '1'};
			}
		});
		model = controller.gatherFormData();
	});
		
	controller.get('formFields').forEach(function(field){
		if (field === 'spotify')
			assert.equal(controller.get(field), model['spotifyLink']);
		else if (field === 'youtube')
			assert.equal(controller.get(field), model['youTubeLink']);
		else if (field === 'soundcloud')
			assert.equal(controller.get(field), model['soundCloudLink']);
		else
			assert.equal(controller.get(field), model[field]);
	});

	//Model properties not based on user input
	assert.equal(model['albumLink'], 'albumLink');
	assert.equal(model['submittedBy'], 'Brendan');
	assert.equal(model['submittedByID'], '1');
	assert.equal(model['totalPlays'], 1);
	assert.equal(model['video'], true);

	assert.ok(model['createdAt']);

});

test('Clears all form fields in event of save or discard', function (assert) {
	var controller = this.subject();
	var model;

	Ember.run(function(){
		setSession(controller);
		controller.setProperties(modelOne);
		controller.set('userInformation', {
			fetchUser: function () {
				return {id: '1'};
			}
		});
		model = controller.gatherFormData();
		controller.set('albumLink', 'foo');
		controller.set('image', 'foo');
		controller.set('hasVideo', true);
	});

	Ember.run(function(){
		controller.clearForm();
	});

	controller.get('formFields').forEach(function(field){
		assert.equal(controller.get(field), '');
	});

});


function setSession (controller) {
	controller.set('session', {currentUser: {displayName: 'Brendan'}});
	controller.set('userProfiles', {user: {id: '1'}});
}

var modelOne = {
	album: 'album',
	albumLink: 'albumLink',
	artist: 'artist', 
	review: 'review', 
	image: 'image', 
	title: 'title',
	year: 'year',
	spotify: 'spotify', 
	youtube: 'youtube', 
	soundcloud: 'soundcloud',
	hasVideo: true
};
