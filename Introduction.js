EWW.Introduction = function (game) {

};

EWW.Introduction.prototype = {

	create: function () {
        var game = this;
        game.levelData = JSON.parse(game.cache.getText('levels'));
        game.buttonClick = game.add.audio(game.levelData.audio[0].buttonClickAudio);
        game.transitionSound = game.add.audio(game.levelData.audio[0].transitionAudio);
        game.add.sprite(0,0,game.levelData.sprites[0].introBG);
        game.skipButton = game.add.sprite(game.world.width*.8, game.world.height/6, game.levelData.sprites[0].skipButton);
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
            game.buttonClick.play();
            game.buttonClick.onStop.add(function(){
                game.transitionSound.play();
            })
            var nextBG = game.add.sprite(-1500, 0, 'bg1');
            var BGTween = game.add.tween(nextBG).to({
                x: 0
            }, 800, "Linear", true);
            BGTween.onComplete.add(function () {
                game.state.start('Game');
            })
        })

	},

	update: function () {


	},


};