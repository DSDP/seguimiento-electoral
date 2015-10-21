import Ember from 'ember';

export function colorDiv(color) {
	return '<div class="bottom-border"><span style="float: left;width: 100%;height: 6px; background-color: ' + color + ';"></span></div>';
}

export default Ember.HTMLBars.makeBoundHelper(colorDiv);
