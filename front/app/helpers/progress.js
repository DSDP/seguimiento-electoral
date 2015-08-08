import Ember from 'ember';

export function progress(progress) {
  if (progress > 0) {
  	return '<span class="meter" style="width: ' + progress + '%"></span>';
  } else {
  	return '';
  }
}

export default Ember.HTMLBars.makeBoundHelper(progress);
