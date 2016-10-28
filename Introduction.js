BasicGame.Introduction = function (game) {

};

BasicGame.Introduction.prototype = {

	create: function () {
        var game = this;
        game.skipButton = game.add.sprite(game.world.width*.8, game.world.height/6, 'skipbtn');
        game.skipButton.anchor.setTo(.5,.5);
        game.add.tween(game.skipButton.scale).from({
            x: 0
            , y: 0
        }, 1000, "Elastic", true);
        game.skipButton.inputEnabled = true;
        game.skipButton.events.onInputOver.add(function(sprite){
            var playTween = game.add.tween(sprite.scale).to({
                x: 1.1
                , y: 1.1
            }, 300, Phaser.Easing.Back.Out, true);
        })
        game.skipButton.events.onInputOut.add(function(sprite){
            var stopTween = game.add.tween(sprite.scale).to({
                x: 1
                , y: 1
            }, 500, "Elastic", true);
        })
        game.skipButton.events.onInputDown.add(function(){
            game.state.start('Game');
        })

	},

	update: function () {


	},


};