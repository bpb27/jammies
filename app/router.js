import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('users');
  this.route('user', { path: '/user/:user_id' });
  this.route('music');
  this.route('submission', function() {
    this.route('song');
  });
});

export default Router;
