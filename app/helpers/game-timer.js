import Ember from 'ember';

export

function gameTimer(params /*, hash*/ ) {
	/*
	 * Return Timer
	 * mm:ss
	 * */
	var minutes = parseInt(params / 60);
	var seconds = params - 60 * minutes;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return minutes + ':' + seconds;
}

export
default Ember.HTMLBars.makeBoundHelper(gameTimer);
