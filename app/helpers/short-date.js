import Ember from 'ember';

export function shortDate(params/*, hash*/) {
  return moment(params[0]).format('M/D/YY');
}

export default Ember.Helper.helper(shortDate);
