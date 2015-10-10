import { moduleFor, test } from 'ember-qunit';

moduleFor('service:user-profiles', 'Unit | Service | user profiles', {
  // Specify the other units that are required for this test.
  needs: ['model:user']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});
