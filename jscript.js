$(document).ready(function() {
	$("body").on("click", "a.scroll", function(event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $($(this).attr("href")).offset().top
		}, 200);
	})
})