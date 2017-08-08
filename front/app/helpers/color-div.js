import Ember from 'ember';

export function colorDiv(color) {
	if (color[0] === undefined || color[0] === null) {
		color = '#000';
	}
	return '<div class="force-color"><span style="background-color: ' + color + ';"></span></div>';
}

export default Ember.HTMLBars.makeBoundHelper(colorDiv);
