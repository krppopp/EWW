BasicGame.Main = function (game) {

};

BasicGame.Main.prototype = {

	create: function () {
        var game = this;
        game.playButton = game.add.sprite(game.world.width/2, game.world.height/2, 'playbtn');
        game.add.tween(game.playButton.scale).from({
            x: 0
            , y: 0
        }, 1000, "Elastic", true);
        game.playButton.anchor.setTo(.5,.5);
        game.playButton.inputEnabled = true;
        game.playButton.events.onInputOver.add(function(sprite){
            var playTween = game.add.tween(sprite.scale).to({
                x: 1.1
                , y: 1.1
            }, 300, Phaser.Easing.Back.Out, true);
        })
        game.playButton.events.onInputOut.add(function(sprite){
            var stopTween = game.add.tween(sprite.scale).to({
                x: 1
                , y: 1
            }, 500, "Elastic", true);
        })

	},

	update: function () {
        if(this.input.activePointer.isDown){
            this.state.start('Introduction');   
        }
	},


};