BasicGame.Game = function (game) {
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    this.game; //  a reference to the currently running game (Phaser.Game)
    this.add; //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera; //  a reference to the game camera (Phaser.Camera)
    this.cache; //  the game cache (Phaser.Cache)
    this.input; //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load; //  for preloading assets (Phaser.Loader)
    this.math; //  lots of useful common math operations (Phaser.Math)
    this.sound; //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage; //  the game stage (Phaser.Stage)
    this.time; //  the clock (Phaser.Time)
    this.tweens; //  the tween manager (Phaser.TweenManager)
    this.state; //  the state manager (Phaser.StateManager)
    this.world; //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;
    this.rnd; //  the repeatable random number generator (Phaser.RandomDataGenerator)
};
BasicGame.Game.prototype = {
    create: function () {
        var game = this;
        //game.stage.backgroundColor = "#f2c07b";
        //round num is the round number
        //match num is the total
        game.roundNum = 0;
        game.add.sprite(0,0,'bg1');
        game.spriteNum = 12;
        game.transitionPosX = -300;
        game.newScale = 2;
        game.hasTransitioned = false;
        //for movement/matching
        game.activeObject = null;
        game.follow = false;
        game.clickNum = 0;
        //for placement
        game.roundYPos = [];
        game.roundYPos[0] = [.25, .75];
        game.roundYPos[1] = [.2, .5, .8];
        game.roundYPos[2] = [.12, .35, .64, .91];
        game.roundYPos[3] = [.12, .35, .64, .91];
        game.staticRoundYPos = [];
        game.staticRoundYPos[0] = [.75, .25];
        game.staticRoundYPos[1] = [.5, .8, .2];
        game.staticRoundYPos[2] = [.91, .64, .12, .35];
        game.staticRoundYPos[3] = [.91, .64, .12, .35];
        game.matchObjPosX = 200;
        game.staticObjPosX = 800;
        game.spriteNum = 12;
        game.transitionPosXLeft = -100;
        game.transitionPosXRight = 1300;
        //2D array for object positions
        game.levelData = JSON.parse(game.cache.getText('levels'));
        game.roundDesign = [game.levelData.levels];
        game.seenLevels = [];
        game.lastRound = 0;
        game.set = game.rnd.integerInRange(0, 2);
        //start the game
        game.roundCreate(game.roundNum);
    }
    , update: function () {
        var game = this;
        //for stick and click
        if (game.follow) {
            game.activeObject.alpha = .8;
            game.activeObject.x = game.input.mousePointer.x - 5;
            game.activeObject.y = game.input.mousePointer.y - 5;
        }
        else {
            game.matchObjects.setAll("immovable", "true");
        }
        if(game.input.activePointer.isUp){
            game.physics.arcade.overlap(game.matchObjects, game.staticObjects, game.matchChara, null, this);
        }
        //coll checks
        if (!game.follow) {
            game.physics.arcade.overlap(game.matchObjects, game.completeObjects, game.noMatch, null, this);
            game.physics.arcade.overlap(game.matchObjects, game.matchObjects, game.matchObjCol, null, this);
        }
    }
    , matchObjCol: function (matchObj1, matchObj2) {
        var game = this;
        var overlapTween1 = game.add.tween(matchObj1).to({
            y: matchObj1.y + 10
        }, 2, "Bounce", true);
        var overlapTween2 = game.add.tween(matchObj2).to({
            y: matchObj2.y - 10
        }, 2, "Linear", true);
    }, //create function for every round
    roundCreate(roundToPlay) {
        var game = this;
        game.removeThings();
        game.correctTween = [];
        game.wrongAnswers = 0;
        game.rightAnswers = 0;
        var tempRoundNum = roundToPlay;
        game.lastRound = tempRoundNum;
        game.matchNum = tempRoundNum += 2;
        var bg = game.add.sprite(0,0,game.roundDesign[0][roundToPlay][game.set].Background);
        //groups to track what items are what
        //items go into the complete objects group when they've been matched
        game.matchObjects = game.add.group();
        game.staticObjects = game.add.group();
        game.completeObjects = game.add.group();
        //physics garbage
        game.matchObjects.enableBody = true;
        game.matchObjects.physicsBodyType = Phaser.Physics.ARCADE;
        game.matchObjects.setAll("collideWorldBounds", true);
        game.staticObjects.enableBody = true;
        game.staticObjects.physicsBodyType = Phaser.Physics.ARCADE;
        game.completeObjects.enableBody = true;
        game.completeObjects.physicsBodyType = Phaser.Physics.ARCADE;
        //randomly grab a set
        //            if(game.roundDesign[0][roundToPlay][set].Theme){
        //                game.sfx.play(game.roundDesign[0][roundToPlay][set].Sound);
        //            } else{
        //                game.sfx.play(basicIntro);
        //            }
        //creates the items, based on the round number
        for (var i = 0; i < game.matchNum; i++) {
            var newStaticObj = game.staticObjects.create(game.staticObjPosX, game.world.height * game.staticRoundYPos[roundToPlay][i], 'sprites', game.roundDesign[0][roundToPlay][game.set].Static[i]);
            game.add.tween(newStaticObj.scale).from({
                x: 0
                , y: 0
            }, 1000, "Elastic", true);
            var newMatchObj = game.matchObjects.create(game.matchObjPosX, game.world.height * game.roundYPos[roundToPlay][i], 'sprites', game.roundDesign[0][roundToPlay][game.set].Match[i]);
            game.add.tween(newMatchObj.scale).from({
                x: 0
                , y: 0
            }, 1000, "Elastic", true);
        }
        //creates the items, based on the round number
        for (var i = 0; i < game.staticObjects.length; i++) {
            game.staticObjects.children[i].anchor.setTo(.5, .5);
            game.staticObjects.children[i].body.setSize(200, 200, -50, -50);
        }
        for (var i = 0; i < game.matchObjects.length; i++) {
            game.matchObjects.children[i].anchor.setTo(.5, .5);
        }
        //input stuff
        game.matchObjects.setAll('inputEnabled', 'true');
        game.matchObjects.onChildInputDown.add(function (sprite) {
            //game.sfx.play(sprite.name);
            sprite.body.collideWorldBounds = true;
            var clickScaleTween = game.add.tween(sprite.scale).to({
                x: 1.2
                , y: 1.2
            }, 100, "Linear", true);
            sprite.alpha = .8;
            if (Phaser.Device.desktop) {
                game.activeObject = sprite;
                game.follow = true;
            }
        });
        game.matchObjects.onChildInputUp.add(function (sprite) {
            game.clickNum++;
            var clickScaleTween = game.add.tween(sprite.scale).to({
                x: 1.0
                , y: 1.0
            }, 100, "Linear", true);
            if (!Phaser.Device.desktop) {
                sprite.alpha = 1;
            }
            if (game.clickNum == 2) {
                sprite.alpha = 1;
                if (Phaser.Device.desktop) {
                    game.follow = false;
                    game.activeObject = null;
                    game.clickNum = 0;
                }
            }
        });
        game.matchObjects.onChildInputOver.add(function (sprite) {
            if (!game.follow) {
                game.hoverTween = game.add.tween(sprite).to({
                    angle: [5, -5, 5, -5, 5, -5, 0]
                }, 1000, "Linear", true);
            }
        })
        game.matchObjects.onChildInputOut.add(function (sprite) {
            sprite.angle = 0;
            game.hoverTween.stop();
        })
        if (!Phaser.Device.desktop) {
            for (var i = 0; i < game.matchObjects.length; i++) {
                game.matchObjects.children[i].input.enableDrag(true);
            }
        }
    }
    //remove all things at the start of a new round
    
    , removeThings: function () {
            var game = this;
            game.world.removeAll();
        }
        //function to run when two items are colliding
        
    , matchChara: function (matchObj, staticObj) {
            var game = this;
            console.log("ayyyye");
            if (matchObj.z == staticObj.z) {
                game.correctAnswer = true;
                //game.sfx.play(correct);
                matchObj.enabledBody = false;
                staticObj.enableBody = false;
                game.completeObjects.add(matchObj);
                game.completeObjects.add(staticObj);
                game.wrongAnswers = 0;
                game.rightAnswers++;
                var myIndex = game.rightAnswers;
                matchObj.bringToTop();
                game.correctTween = game.add.tween(matchObj).to({
                    x: staticObj.x, y: staticObj.y
                }, 2000, "Linear", true);
                game.clickNum = 0;
                game.follow = false;
                matchObj.alpha = 1;
                game.activeObject = null;
                game.correctTween.onComplete.add(function (tween) {
                    game.correctAnswer = false;
                    if (game.matchNum == game.rightAnswers && myIndex == game.rightAnswers) {
                        if (game.roundNum < game.roundDesign[0].length - 1) {
                            game.roundNum++;
                            game.set = game.rnd.integerInRange(0, 2);
                            var bg = game.add.sprite(0,0,game.roundDesign[0][game.roundNum][game.set].Background);
                            var BGTween = game.add.tween(bg).from({
                                x: -game.world.width-1000
                            }, 2000, "Linear", true);
                            BGTween.onComplete.add(function () {
                                game.roundCreate(game.roundNum);  
                            })
                        }
                        else {
                            game.set = game.rnd.integerInRange(0, 2);
                            var bg = game.add.sprite(0,0,game.roundDesign[0][game.roundNum][game.set].Background);
                            var BGTween = game.add.tween(bg).from({
                                x: -game.world.width-1000
                            }, 2000, "Linear", true);
                            BGTween.onComplete.add(function () {
                                var nextRound = 0;
                                do{
                                    nextRound = game.rnd.integerInRange(1,game.roundDesign[0].length-1);
                                } while (nextRound == game.lastRound);
                                game.roundCreate(nextRound);
                            })
                        }
                        //game.sfx.play(finalMatchSound);
                        //when have sounds, end based on sounds instead of tween
                    }
                });
            }
            else {
                if(!game.correctAnswer)
                    if (game.clickNum == 0) {
                        matchObj.x = game.matchObjPosX;
                        matchObj.y = (game.world.height * game.roundYPos[game.roundNum][matchObj.z]);
                        game.wrongAnswers++;
                        if (game.wrongAnswers == 1) {
                            //game.sfx.play(WA1);
                        }
                        if (game.wrongAnswers == 2) {
                            for (var i = 0; i < game.staticObjects.length; i++) {
                                if (matchObj.z == game.staticObjects.children[i].z) {
                                    var correctObject = game.staticObjects.children[i];
                                    break;
                                }
                            }
                            game.pulseCorrect(matchObj, correctObject);
                        }
                        if (game.wrongAnswers == 3) {
                            for (var i = 0; i < game.staticObjects.length; i++) {
                                if (matchObj.z == game.staticObjects.children[i].z) {
                                    var correctObject = game.staticObjects.children[i];
                                    break;
                                }
                            }
                            game.drawLines(matchObj, correctObject);
                        }
                    }
                
            }
        }
        //function that runs when an already matched item matches with an unmatched item 
        
    , noMatch: function (matchObj, staticObj) {
            var game = this;
            if (game.clickNum == 0) {
                game.wrongAnswers++;
                matchObj.x = game.matchObjPosX;
                matchObj.y = (game.world.height * game.roundYPos[game.roundNum][matchObj.z]);
                if (game.wrongAnswers == 1) {
                    //game.sfx.play(WA1);
                }
                if (game.wrongAnswers == 2) {
                    for (var i = 0; i < game.staticObjects.length; i++) {
                        if (matchObj.z == game.staticObjects.children[i].z) {
                            var correctObject = game.staticObjects.children[i];
                            break;
                        }
                    }
                    game.pulseCorrect(matchObj, correctObject);
                }
                if (game.wrongAnswers == 3) {
                    for (var i = 0; i < game.staticObjects.length; i++) {
                        if (matchObj.z == game.staticObjects.children[i].z) {
                            var correctObject = game.staticObjects.children[i];
                            break;
                        }
                    }
                    game.drawLines(matchObj, correctObject);
                }
            }
        }
        //function for winning
        
    , youWin: function () {
            var game = this;
        }
        //function to make the dotted line hint stuff
        
    , drawLines: function (point1, point2) {
            var game = this;
            //game.sfx.play(WA1);
            game.wrongAnswers = 0;
            var graphics = game.add.graphics(0, 0);
            graphics.lineStyle(20, 0xffd900);
            for (var i = 1; i < 10; i++) {
                var pointA = point1.x + (point2.x - point1.x) * (i / 6);
                var pointB = point1.y + (point2.y - point1.y) * (i / 6);
                graphics.drawCircle(pointA, pointB, 20);
                if (pointA >= point2.x) {
                    game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                        graphics.destroy();
                    });
                    break;
                }
            }
        }
        //function to make the pulsing hint stuff
        
    , pulseCorrect: function (obj1, obj2) {
        var game = this;
        //game.sfx.play(WA2);
        game.time.events.repeat(Phaser.Timer.SECOND, 3, function () {
            var tween = game.add.tween(obj1).to({
                alpha: .2
            }, 200, "Linear", true);
            var scaleTween = game.add.tween(obj1.scale).to({
                x: 1.2
                , y: 1.2
            }, 200, "Linear", true);
            var roTween = game.add.tween(obj1).to({
                angle: [5, -5, 5, -5, 5, -5, 0]
            }, 2000, "Linear", true);
            tween.yoyo(true, 200);
            scaleTween.yoyo(true, 200);
            var tween2 = game.add.tween(obj2).to({
                alpha: .2
            }, 200, "Linear", true);
            var scaleTween2 = game.add.tween(obj2.scale).to({
                x: 1.2
                , y: 1.2
            }, 200, "Linear", true);
            var roTween2 = game.add.tween(obj2).to({
                angle: [5, -5, 5, -5, 5, -5, 0]
            }, 2000, "Linear", true);
            tween2.yoyo(true, 200);
            scaleTween2.yoyo(true, 200);
        });
    },
};