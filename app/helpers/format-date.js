import Ember from 'ember';

export function formatDate(params/*, hash*/) {
  return moment(params[0]).fromNow();
}

export default Ember.Helper.helper(formatDate);
