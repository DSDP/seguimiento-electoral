import Ember from 'ember';

export function colorDiv(color) {
	return '<div class="force-color"><span style="background-color: ' + color + ';"></span></div>';
}

export default Ember.HTMLBars.makeBoundHelper(colorDiv);
