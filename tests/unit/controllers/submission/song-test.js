import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:submission/song', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('Determine spotify query checks for youtube link and creates a query based on artist and title', function (assert) {
	var controller = this.subject();
	controller.set('youtube', 'link');
	controller.set('title', 'inertiatic esp');
	controller.set('artist', 'mars volta');

	var link = "https://api.spotify.com/v1/search?q=track%3Ainertiatic+esp+artist%3Amars+volta&type=track";

	assert.equal(controller.determineSpotifyQuery(), link);

});

test('Determine spotify id correctly parses input', function (assert) {
	var controller = this.subject();

	var link = 'https://open.spotify.com/track/5OzHuTzS6K5mn8oQg7owRf';
	var uri = 'spotify:track:5OzHuTzS6K5mn8oQg7owRf';
	var embed = '<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%5OzHuTzS6K5mn8oQg7owRf" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
	var id = '5OzHuTzS6K5mn8oQg7owRf';

	assert.equal(controller.determineSpotifyId(link), id);
	assert.equal(controller.determineSpotifyId(uri), id);
	assert.equal(controller.determineSpotifyId(embed), id);

});

test('Determine youtube id correctly parses input', function (assert) {
	var controller = this.subject();

	var link = 'https://www.youtube.com/watch?v=bw3S1dlsGzU';
	var link2 = 'https://youtu.be/bw3S1dlsGzU';
	var id = 'bw3S1dlsGzU';

	assert.equal(controller.determineYoutubeId(link), id);
	assert.equal(controller.determineYoutubeId(link2), id);
	assert.equal(controller.determineYoutubeId(id), id);

});

test('Spotify only submission', function (assert) {
	var controller = this.subject();
  var songData;

	Ember.run(function(){
		setSession(controller);

		controller.setProperties(spotifyOnlyFormData);
		controller.set('image', spotifyOnlySubmission['image']);
		controller.set('albumLink', spotifyOnlySubmission['albumLink']);

		songData = controller.gatherFormData();
    assert.ok(controller.validate(songData));

	});

  dataMatch(songData, spotifyOnlySubmission, assert);

});

test('Youtube only submission', function (assert) {
	var controller = this.subject();
  var songData;

	Ember.run(function(){
		setSession(controller);

		controller.setProperties(youtubeOnlyFormData);
    controller.set('hasVideo', true);

		songData = controller.gatherFormData();
    assert.ok(controller.validate(songData));

	});

  dataMatch(songData, youtubeOnlySubmission, assert);

});

test('Spotify and Youtube submission', function (assert) {
	var controller = this.subject();
  var songData;

	Ember.run(function(){
		setSession(controller);

		controller.setProperties(spotifyAndYoutubeFormData);
		controller.set('image', spotifyAndYoutubeSubmission['image']);
		controller.set('albumLink', spotifyAndYoutubeSubmission['albumLink']);

		songData = controller.gatherFormData();
    assert.ok(controller.validate(songData));

	});

  dataMatch(songData, spotifyAndYoutubeSubmission, assert);

});

test('Soundcloud only submission', function (assert) {
	var controller = this.subject();
  var songData;

	Ember.run(function(){
		setSession(controller);

		controller.setProperties(soundcloudOnlyFormData);

		songData = controller.gatherFormData();
    assert.ok(controller.validate(songData));

	});

  dataMatch(songData, soundcloudOnlySubmission, assert);

});



function setSession (controller) {
	controller.set('session', {currentUser: {displayName: 'Brendan Brown'}});
	controller.set('userProfiles', {user: {id: '1'}});
  controller.set('userInformation', { fetchUser: function () { return {id: '1'}; } });
}

function dataMatch (results, submissionToMatch, assert) {
  var fields = [
    'album',
    'review',
    'title',
    'year',
    'spotifyLink',
    'soundCloudLink',
    'youTubeLink',
    'video',
    'totalPlays',
    'image',
    'submittedBy',
    'submittedByID'
  ];

  fields.forEach(function (field) {
    assert.equal(results[field], submissionToMatch[field], field);
  });

  assert.ok(results['createdAt'], 'Created At');

}

var spotifyOnlyFormData = {
  "album": "Flesh without Blood",
  "artist": "Grimes",
  "review": "Good",
  "title": "Flesh without Blood",
  "year": "2015",
  "spotify": "spotify:track:1JYtlIFdYms6nZNf2K7Yys"
};

var spotifyOnlySubmission = {
  "album": "Flesh without Blood",
  "artist": "Grimes",
  "createdAt": "2015-12-12T17:13:25.430Z",
  "review": "Good",
  "image": "https://i.scdn.co/image/0faef4408eb4f1eed3f4876532a0987fd2ee1d10",
  "title": "Flesh without Blood",
  "totalPlays": 1,
  "video": false,
  "year": "2015",
  "albumLink": "spotify:album:2fsDt7nVNKN47KT23Bki49",
  "spotifyLink": "spotify:track:1JYtlIFdYms6nZNf2K7Yys",
  "soundCloudLink": undefined,
  "youTubeLink": undefined,
  "submittedBy": "Brendan Brown",
  "submittedByID": "1"
};

var youtubeOnlyFormData = {
  "album": "Teens of Style",
  "artist": "Car Seat Headrest",
  "review": "Good",
  "title": "Something Soon",
  "year": "2015",
  "youtube": "https://www.youtube.com/watch?v=WjnEkJa2Law"
};

var youtubeOnlySubmission = {
  "album": "Teens of Style",
  "albumLink": undefined,
  "artist": "Car Seat Headrest",
  "createdAt": "2015-12-12T18:01:46.159Z",
  "review": "Good",
  "soundCloudLink": undefined,
  "image": "assets/images/vinylcover.jpg",
  "title": "Something Soon",
  "totalPlays": 1,
  "video": true,
  "year": "2015",
  "spotifyLink": undefined,
  "youTubeLink": "WjnEkJa2Law",
  "submittedBy": "Brendan Brown",
  "submittedByID": "1"
};

var spotifyAndYoutubeFormData = {
  "album": "Flesh without Blood",
  "artist": "Grimes",
  "review": "Good",
  "title": "Flesh without Blood",
  "year": "2015",
  "spotify": "spotify:track:1JYtlIFdYms6nZNf2K7Yys",
  "youtube": "https://www.youtube.com/watch?v=Tv9YoYCKNoE"
};

var spotifyAndYoutubeSubmission = {
  "album": "Flesh without Blood",
  "artist": "Grimes",
  "createdAt": "2015-12-12T17:15:12.585Z",
  "review": "Good",
  "image": "https://i.scdn.co/image/0faef4408eb4f1eed3f4876532a0987fd2ee1d10",
  "title": "Flesh without Blood",
  "totalPlays": 1,
  "video": false,
  "year": "2015",
  "albumLink": "spotify:album:2fsDt7nVNKN47KT23Bki49",
  "spotifyLink": "spotify:track:1JYtlIFdYms6nZNf2K7Yys",
  "youTubeLink": "Tv9YoYCKNoE",
  "soundCloudLink": undefined,
  "submittedBy": "Brendan Brown",
  "submittedByID": "1"
};

var soundcloudOnlyFormData = {
  "album": "Unreleased",
  "artist": "Kendrick Lamar",
  "review": "Good",
  "title": "Black Friday",
  "year": "2015",
  "soundcloud": "https://soundcloud.com/topdawgent/kendrick-lamar-black-friday"
};

var soundcloudOnlySubmission = {
  "album": "Unreleased",
  "albumLink": undefined,
  "artist": "Kendrick Lamar",
  "createdAt": "2015-12-12T19:52:45.752Z",
  "review": "Good",
  "image": "assets/images/vinylcover.jpg",
  "title": "Black Friday",
  "totalPlays": 1,
  "video": false,
  "year": "2015",
  "spotifyLink": undefined,
  "youTubeLink": undefined,
  "soundCloudLink": "https://soundcloud.com/topdawgent/kendrick-lamar-black-friday",
  "submittedBy": "Brendan Brown",
  "submittedByID": "1"
};
