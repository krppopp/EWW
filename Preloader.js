BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
        this.load.atlasJSONArray('sprites', 'Assets/phart.png', 'Assets/phart.json');
        this.load.image('playbtn', 'Assets/play.png');
        this.load.image('skipbtn', 'Assets/skip.png');
        this.load.text('levels', 'levels.json');
	},

	create: function () {

	},

	update: function () {
        this.state.start('Main');
	}

};