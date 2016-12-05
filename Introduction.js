EWW.Introduction = function (game) {};
EWW.Introduction.prototype = {
    create: function () {
        var game = this;
        game.levelData = JSON.parse(game.cache.getText('levels'));
        game.buttonClick = game.add.audio(game.levelData.audio[0].buttonClickAudio);
        game.transitionSound = game.add.audio(game.levelData.audio[0].transitionAudio);
        game.add.sprite(0, 0, game.levelData.sprites[0].introBG);
        if (!window.doNotDisplayClose) {
            game.exitButton = game.add.sprite(game.world.width * .9, game.world.height * .02, game.levelData.sprites[0].exitButton, 0);
            game.exitButton.inputEnabled = true;
            game.exitButton.events.onInputOver.add(function (sprite) {
                sprite.frame = 1;
            })
            game.exitButton.events.onInputDown.add(function (sprite) {
                sprite.frame = 2;
                window.close();
            })
            game.exitButton.events.onInputOut.add(function (sprite) {
                sprite.frame = 0;
            })
        }
        game.elmos = [];
        game.elmoAnim = [];
        for (var i = 0; i < game.levelData.sprites[0].introAnimationSheetsNum; i++) {
            game.elmos[i] = game.add.sprite(game.world.width / 2, game.world.height / 2, game.levelData.sprites[0].introAnimation + i, 0);
            game.elmos[i].anchor.setTo(.5, .5);
            game.elmos[i].index = i;
            game.elmoAnim[i] = game.elmos[i].animations.add('animate', Phaser.Animation.generateFrameNames(game.levelData.sprites[0].introAnimation + "/", game.levelData.sprites[0].introAnimFrameStart[i], game.levelData.sprites[0].introAnimFrameEnd[i], '', 4), 20, false);
            console.log(game.elmoAnim[i]);
            game.elmoAnim[i].onComplete.add(function (sprite) {
                sprite.visible = false;
                game.elmos[sprite.index + 1].visible = true;
                game.elmoAnim[sprite.index + 1].play();
            })
            if (i > 0) {
                game.elmos[i].visible = false;
            }
        }
        game.elmoAnim[0].onStart.add(function(){
            console.log("did i in????");
            game.introVO = game.add.audio(game.levelData.audio[0].introIntroVO);
            game.intstrVO = game.add.audio(game.levelData.audio[0].introInstrVO);
            game.concVO = game.add.audio(game.levelData.audio[0].introConclVO);
            game.introVO.play();
            game.introVO.onStop.add(function () {
                game.intstrVO.play();
                game.intstrVO.onStop.add(function () {
                    game.concVO.play();
                    game.concVO.onStop.add(function () {
                        game.state.start('Game');
                    })
                })
            }) 
        });
          game.elmoAnim[0].play();
    }
    , update: function () {}
, };