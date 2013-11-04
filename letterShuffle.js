(function(root) {
	var LetterShuffle = root.LetterShuffle = (root.LetterShuffle || {})

	var letterGroups = [];

	LetterShuffle.delay = 30000;
	LetterShuffle.duration = 5000;
	LetterShuffle.speed = 1;

	Math.easeInQuad = function (t, b, c, d) {
		if (t > d) {
			return b + c;
		}
		t /= d;
		return c*t*t + b;
	};

	var undoLettering = function($target) {
		var textString = "";
		$target.children("[class^=char]").each(function() {
			textString += $(this).text();
		});
		$target.html(textString);
	}

	var getLettersFromEl = LetterShuffle.getLettersFromEl = function($target, winTop) {
		//Lettering wraps each character of the target elements in a span tag
		var savedHtml = $target.html();
		var font = $target.css("font");
		var color = $target.css("color");

		$target.lettering();

		var letters = [];

		//Save the left and top positions from each character before we change
		//their position to absolute
		$target.children("*").each(function(index) {
			letters[index] = {
				letter: $(this).text(),
				startTop: $(this).offset().top - winTop,
				startLeft: $(this).offset().left + 0.5,
				dx: Math.random() * LetterShuffle.speed - LetterShuffle.speed / 2,
				dy: Math.random() * LetterShuffle.speed - LetterShuffle.speed / 2,
				x: $(this).offset().left + 0.5,
				y: $(this).offset().top - winTop
			};
		})

		letterGroups.push({
			font: font,
			color: color,
			letters: letters
		});

		$target.html(savedHtml);
	};

	var start = LetterShuffle.start = function() {

		$("canvas").show();
		var canvas = document.getElementById("canvas");
		var ctx = LetterShuffle.ctx = canvas.getContext("2d");
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.textBaseline = "top";
		var top = $(window).scrollTop();
		var bottom = top + window.innerHeight;

		LetterShuffle.$targets = $("h1, h2, h3, h4, h5, h6, p, span, .uiAttachmentTitle, .uiAttachmentDesc, .linkWrap, a")
				.filter(":not([class^=char])")
				.filter(function() {
					var p = $(this).offset().top;
					var height = $(this).height();
					return ((p + height >= top && p <= bottom) && $(this).height() > 5 && $(this).position().left > 10);
				})
				.filter(function() {
					return $(this).children().length === 0;
				})

		// console.log(LetterShuffle.$targets);
		LetterShuffle.$targets.each(function() { getLettersFromEl($(this), top); });
		console.log(letterGroups);
		setTimeout(function() { LetterShuffle.$targets.css({ "visibility": "hidden" }); }, 30);
		LetterShuffle.time = 0;
		LetterShuffle.intervalId = setInterval(function() {
			LetterShuffle.time += 30;
			drawLetters(ctx);
		}, 30);
	}

	var end = LetterShuffle.end = function() {
		$("canvas").hide();
		window.clearInterval(LetterShuffle.intervalId);
		LetterShuffle.intervalId = undefined;
		LetterShuffle.$targets.css("visibility", "visible");
		var ctx = LetterShuffle.ctx;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		letterGroups = [];
	}

	var drawLetters = function(ctx) {
		var width = ctx.canvas.width;
		var height = ctx.canvas.height;
		ctx.clearRect(0, 0, width, height);
		letterGroups.forEach(function(letterGroup) {
			ctx.font = letterGroup.font;
			ctx.fillStyle = letterGroup.color;
			letterGroup.letters.forEach(function(letterObj) {
				if (letterObj.x < 0 || letterObj.x > width) {
					letterObj.dx *= -1;
				}
				if (letterObj.y < 0 || letterObj.y > height) {
					letterObj.dy *= -1;
				}
				letterObj.x = Math.easeInQuad(LetterShuffle.time, letterObj.x, letterObj.dx, LetterShuffle.duration)
				letterObj.y = Math.easeInQuad(LetterShuffle.time, letterObj.y, letterObj.dy, LetterShuffle.duration)
				ctx.fillText(letterObj.letter, letterObj.x, letterObj.y);
			})
		})
	}
})(this);