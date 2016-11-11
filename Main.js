EWW.Main = function (game) {};
EWW.Main.prototype = {
    create: function () {
        var game = this;
        game.levelData = JSON.parse(game.cache.getText('levels'));
        game.buttonClick = game.add.audio(game.levelData.audio[0].buttonClickAudio);
        game.transitionSound = game.add.audio(game.levelData.audio[0].transitionAudio);
        
        game.clickedScreen = false;
        game.add.sprite(0, 0, game.levelData.sprites[0].titleImg);
        //        game.spriteNum = 12;
        //        game.transitionPosX = -300;
        //        game.newScale = 2;
        //        game.hasTransitioned = false;
        game.playButton = game.add.sprite(game.world.width / 2, game.world.height / 2, game.levelData.sprites[0].playButton);
        game.add.tween(game.playButton.scale).from({
            x: 0
            , y: 0
        }, 1000, "Elastic", true);
        game.playButton.anchor.setTo(.5, .5);
        game.playButton.inputEnabled = true;
        game.playButton.events.onInputOver.add(function (sprite) {
            var playTween = game.add.tween(sprite.scale).to({
                x: 1.1
                , y: 1.1
            }, 300, Phaser.Easing.Back.Out, true);
        })
        game.playButton.events.onInputOut.add(function (sprite) {
            var stopTween = game.add.tween(sprite.scale).to({
                x: 1
                , y: 1
            }, 500, "Elastic", true);
        })
    }
    , update: function () {
            var game = this;
            if (this.input.activePointer.isDown && !game.clickedScreen) {
                game.buttonClick.play();
                game.buttonClick.onStop.add(function(){
                    game.transitionSound.play();
                })
                game.playButton.inputEnabled = false;
                game.playButton.inputEnabled = false;
                var playTween = game.add.tween(game.playButton.scale).to({
                    x: 0
                    , y: 0
                }, 500, "Linear", true);
                game.add.tween(game.playButton).to({
                    angle: +360
                }, 500, "Linear", true);
                playTween.onComplete.add(function () {
                    game.playButton.destroy();
                });
                var nextBG = game.add.sprite(-1500, 0, 'bg2');
                var BGTween = game.add.tween(nextBG).to({
                    x: 0
                }, 800, "Linear", true);
                BGTween.onComplete.add(function () {
                    game.state.start('Introduction');
                })
                game.clickedScreen = true;
            }
        }
        //    , transition: function () {
        //        var game = this;
        //        if (!game.hasTransitioned) {
        //            game.lastHeight = -10;
        //            game.lastHeight2 = -10;
        //            game.lastPos = -10;
        //            game.lastPos2 = -10;
        //            var nextBG = game.add.sprite(-1500, 0, 'bg2');
        //            var BGTween = game.add.tween(nextBG).to({
        //                x: 0
        //            }, 4000, "Linear", true);
        //            BGTween.onComplete.add(function () {
        //                game.state.start('Introduction');
        //            })
        //            game.playButton.inputEnabled = false;
        //            var playTween = game.add.tween(game.playButton.scale).to({
        //                x: 0
        //                , y: 0
        //            }, 500, "Linear", true);
        //            game.add.tween(game.playButton).to({
        //                angle: +360
        //            }, 500, "Linear", true);
        //            playTween.onComplete.add(function () {
        //                game.playButton.destroy();
        //            })
        //            for (var i = 0; i < game.spriteNum; i++) {
        //                var newSprite = game.add.sprite(game.transitionPosX+10, game.lastPos + game.lastHeight, 'sprites', game.rnd.integerInRange(0, game.spriteNum - 2));
        //                game.lastHeight = newSprite.height;
        //                game.lastPos = newSprite.y;
        //                newSprite.scale.x = 2;
        //                newSprite.scale.y = 2;
        //                var newTween = game.add.tween(newSprite).to({
        //                    x: 1300
        //                }, 4200, "Linear", true);
        ////                var otherSprite = game.add.sprite(game.transitionPosX-100, game.lastPos2 + game.lastHeight2, 'sprites', game.rnd.integerInRange(0, game.spriteNum - 2));
        ////                game.lastHeight2 = newSprite.height;
        ////                game.lastPos2 = newSprite.y;
        ////                otherSprite.scale.x = 2;
        ////                otherSprite.scale.y = 2;
        ////                var newTween = game.add.tween(otherSprite).to({
        ////                    x: 1300
        ////                }, 4500, "Linear", true);
        //            }
        //        }
        //    }
};