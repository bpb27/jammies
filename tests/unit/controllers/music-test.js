import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:music', {
  // needs: ['controller:foo']
});

test('Filtered content updates on query', function(assert) {
	var controller = this.subject({
		query: 'One',
		model: createModels(1, mockModel)
	});

	assert.equal(controller.get('query'), 'One');
	assert.equal(controller.get('model').length, 1);
	assert.equal(controller.get('filteredContent').length, 1);
	controller.set('query', 'Two');
	assert.equal(controller.get('filteredContent').length, 0);
});

test('Filtered content updates on sortBy action', function(assert) {
	var controller = this.subject({
		model: createModels(5, mockModel)
	});

	assert.equal(controller.get('model').length, 5);
	controller.send('sortBy', 'num');
	assert.equal(controller.get('filteredContent')[0].get('title'), 'Five');
	controller.send('sortBy', 'num');
	assert.equal(controller.get('filteredContent')[0].get('title'), 'One');
	controller.send('sortBy', 'num');
	assert.equal(controller.get('filteredContent')[0].get('title'), 'Five');
	
});

test('Valid model', function(assert) {
	var controller = this.subject();
	var failingModel = Ember.Object.create({title: 'One'});
	var passingModel = createModel(mockModel[0]);
	var fail = controller.validModel(failingModel);
	var pass = controller.validModel(passingModel);

	assert.equal(fail, undefined);
	assert.equal(pass, true);
});

var mockModel = [
	{str: 'One', num: 1}, 
	{str: 'Two', num: 2}, 
	{str: 'Three', num: 3}, 
	{str: 'Four', num: 4}, 
	{str: 'Five', num: 5}
];

function createModel (props) {
	return Ember.Object.create({
		title: props.str,
		artist: props.str,
	    album: props.str,
  		submittedBy: props.str,
  		year: props.str,
  		type: props.str,
  		num: props.num,
  		createAt: new Date()
	});
}

function createModels (num, model) {
	var models = [];

	for (var i = 0; i < num; i++) {
		models.push(createModel(model[i]));
	}
	return models;
}
