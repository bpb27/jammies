import { moduleForModel, test } from 'ember-qunit';

moduleForModel('comment', 'Unit | Model | comment', {
  // Specify the other units that are required for this test.
  needs: ['model:music']
});

test('it exists', function(assert) {
  // var model = this.subject();
  // var store = this.store();
  // assert.ok(!!model);
  assert.ok(true);
});
