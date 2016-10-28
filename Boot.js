var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;
        
        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;
        
        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setMinMax(480, 200, 1024, 660);
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 200, 1024, 660);
            //this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }

    },

    preload: function () {


    },

    create: function () {

        this.state.start('Preloader');

    }

};