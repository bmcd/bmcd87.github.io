$(document).ready(function() {
	$("<canvas id='canvas' style='display: none;'></canvas>").width($(window.width)).appendTo("body");
	$(window).on("keydown", function(event) {
		resetShuffle();
	});
	$(window).click(function(event) {
		resetShuffle();
	});
	$(window).scroll(function(event) {
		resetShuffle();
	});

	LetterShuffle.timeoutId = setTimeout(function() {
		LetterShuffle.start();
	}, LetterShuffle.delay);
});

function resetShuffle() {
	if (LetterShuffle.intervalId) {
		LetterShuffle.end();
	}

	window.clearTimeout(LetterShuffle.timeoutId);
	LetterShuffle.timeoutId = setTimeout(function() {
		LetterShuffle.start();
	}, LetterShuffle.delay);
}
