var game = function () {
    //Función a la que se llamará cuando se cargue el juego
    //Objeto Quinus con los modulos que necesitamos
    var Q = window.Q = Quintus({ audioSupported: [ 'mp3' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({
            maximize: true,
            //width: 320, // Set the default width to 320 pixels
            //height: 480, // Set the default height to 480 pixels
            upsampleWidth: 420, // Double the pixel density of the
            upsampleHeight: 320, // game if the w or h is 420x320
            // or smaller (useful for retina phones)
            downsampleWidth: 1024, // Halve the pixel density if resolution
            downsampleHeight: 768 // is larger than or equal to 1024x768 
        })
        .controls().touch()
        .enableSound();
    //Se cargan los recursos
    Q.load("mainTitle.png, mario_small.png, mario_small.json, goomba.png, goomba.json,bloopa.png, bloopa.json, tiles.png, coin.png, coin.json, princess.png, princess.json, bowser.png, bowser.json, fire.gif, fire.json, coin.mp3, music_die.mp3, music_main.mp3", function () {
        Q.sheet("tiles", "tiles.png", {
            tilew: 32,
            tileh: 32
        });
        Q.compileSheets("mario_small.png", "mario_small.json");
        Q.compileSheets("princess.png", "princess.json");
        Q.compileSheets("coin.png", "coin.json");
        Q.compileSheets("goomba.png", "goomba.json");
        Q.compileSheets("bloopa.png", "bloopa.json");
        Q.compileSheets("bowser.png", "bowser.json");
        Q.compileSheets("fire.gif", "fire.json");
        Q.Sprite.extend("Princess", {
            init: function (p) {
                this._super(p, {
                    sheet: "princess",
                    x: 3500,
                    y: 400,
                    vx: 30,
                    frame: 0
                });
                this.add('2d, aiBounce'); //Para la IA que lo mueve de derecha a izquierda
                //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
                this.on("bump.left,bump.right,bump.bottom, bump.top", function (collision) {
                    if (collision.obj.isA("Player")) {
                        Q.stageScene("endGame", 1, { label: "You Win" });
                    }
                });
            }
        });

        //Se carga el nivel 1 tmx y se añaden los objetos
        Q.scene('mainMenu', function (stage) {
            var box = stage.insert(new Q.UI.Container({
                x: Q.width / 2, y: Q.height / 2, fill: "rgba(1,0,0,0.5)"
            }));

            var button = box.insert(new Q.UI.Button({
                asset: 'mainTitle.png',
                label: ""
            }))
            button.on("click", function () {
                Q.clearStages();
                Q.stageScene('level1');
                Q.stageScene("sumaMonedas",1);
            });
            Q.input.on("confirm", function(){
                Q.clearStages();
                Q.stageScene('level1');
                Q.stageScene("sumaMonedas",1);
            });
            Q.input.on("fire", function(){
                Q.clearStages();
                Q.stageScene('level1');
                Q.stageScene("sumaMonedas",1);
            });
            
            box.fit(20);
        });
        Q.scene("level1", function (stage) {
            Q.state.reset({totalMonedas: 0});
            Q.stageTMX("level.tmx", stage);
            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player);
            stage.insert(new Q.Bloopa({x:2850}));
            stage.insert(new Q.Bloopa({x:3100, vy: 80, y: 300}));
            stage.insert(new Q.Bloopa({x:2600, vy: 100, y: 500, miny: 300, maxy: 450}));
            stage.insert(new Q.Bloopa({x:2400, vy: 200, y: 500, miny: 300, maxy: 500}));
            stage.insert(new Q.Bloopa({x:2190, vy: 300, y: 500, miny: 350, maxy: 550}));
            stage.insert(new Q.Bloopa({x:3300, vy: 150, y: 350}));
            stage.insert(new Q.Coin());
            stage.insert(new Q.Coin({x:500, y: 450}));
            stage.insert(new Q.Coin({x:510, y: 450}));
            stage.insert(new Q.Coin({x:520, y: 450}));
            stage.insert(new Q.Coin({x:530, y: 450}));
            stage.insert(new Q.Goomba());
            stage.insert(new Q.Bowser());
            stage.insert(new Q.Princess());
            stage.insert(new Q.Goomba({ x: 800 }));
            Q.audio.play("music_main.mp3");
        });

        Q.loadTMX("level.tmx", function () {
            Q.stageScene("mainMenu");
        });
        Q.scene('endGame', function (stage) {
            var box = stage.insert(new Q.UI.Container({
                x: Q.width / 2, y: Q.height / 2, fill: "rgba(1,0,0,0.5)"
            }));

            var button = box.insert(new Q.UI.Button({
                x: 0, y: 0, fill: "#CCCCCC",
                label: "Play Again"
            }))
            var label = box.insert(new Q.UI.Text({
                x: 10, y: -10 - button.p.h,
                label: stage.options.label
            }));
            button.on("click", function () {
                Q.clearStages();
                Q.stageScene('mainMenu');
            });
            box.fit(20);
        });
        Q.scene("sumaMonedas", function(stage) {
            var label = stage.insert(new Q.UI.Text({ x: Q.width/2, y: 50, label: "Coins: 0" }));
            Q.state.on("change.totalMonedas", this, function( coin ) {
                label.p.label = "Coins: " + coin;
            });	
        });
        Q.animations('mario_small', {
            run_right: { frames: [0, 1, 2, 3], rate: 1 / 15 },
            run_left: { frames: [14, 15, 16], rate: 1 / 15 },
            stand_right: { frames: [0], rate: 1 / 5 },
            stand_left: { frames: [14], rate: 1 / 5 },
            fall_right: { frames: [2], loop: false },
            fall_left: { frames: [14], loop: false },
            run_up_right: { frames: [4], rate: 1 / 15 },
            run_up_left: { frames: [18], rate: 1 / 15 },
            run_down_right: { frames: [6, 7], rate: 1 / 15 },
            run_down_left: { frames: [20, 21], rate: 1 / 15 }
        });
        Q.animations('goomba_animation', {
            die: { frames: [2], loop: false, rate: 1/15, trigger: "die" },
            run_right: { frames: [0, 1], rate: 1 / 5 },
            run_left: { frames: [0, 1], rate: 1 / 5 }

        });
        Q.animations('bloopa_animation', {
            die: { frames: [2], loop: false, rate: 1/15, trigger: "die" }
        });


    });
    //Sprite de Goomba
    Q.Sprite.extend("Goomba", {
        init: function (p) {
            this._super(p, {
                sheet: "goomba",
                sprite: "goomba_animation",
                x: 500,
                y: 530,
                vx: 100,
                muerte: false
            });
            this.add('2d, aiBounce, animation, defaultEnemy'); //Para la IA que lo mueve de derecha a izquierda            
        },
        step: function (dt) {
            if (this.p.y > 700) {
                Q.stageScene("endGame", 1, { label: "You Died" });
                this.p.x = 300;
                this.p.y = 500;
            }
            else if(!this.p.muerte) {
                if (this.p.vx > 0) this.play("run_right");
                else if (this.p.vx < 0) this.play("run_left");
            }
        }
    });
    //Mario
    Q.Sprite.extend("Player", {
        // the init constructor is called on creation
        init: function (p) {
            // You can call the parent's constructor with this._super(..)
            this._super(p, {
                sprite: "mario_small",
                sheet: "marioR", // Sprite que esta dentro de mario_small.json
                x: 300, //x donde aparecerá
                jumpSpeed: -400,
                y: 500 //y donde aparecerá
            });
            this.add('2d, platformerControls, tween, animation');
        },
        step: function (dt) {
            if (this.p.y > 700) {
                Q.audio.stop('music_main.mp3');
                Q.audio.play("music_die.mp3");
                Q.stageScene("endGame", 1, { label: "You Died" });
                console.log("cayendo");
                this.p.x = 300;
                this.p.y = 500;
            }
            else {
                if (this.p.vx > 0) {
                    this.play("run_right");
                } else if (this.p.vx < 0) {
                    this.play("run_left");
                } else {
                    this.play("stand_" + this.p.direction);
                }
                if (this.p.vy > 0) {
                    this.play("run_down_" + this.p.direction);
                }
                else if (this.p.vy < 0) {
                    this.play("run_up_" + this.p.direction);
                }
            }
        }
    });
    //Bloopa
    Q.Sprite.extend("Bloopa", {
        init: function (p) {
            this._super(p, {
                sheet: "bloopa",
                sprite: "bloopa_animation",
                x: 600,
                y: 400,
                vx: 0,
                vy: 70,
                maxy: 550,
                miny: 350,
                frame: 0
            });
            this.p.gravityY = 0;
            this.add('2d, aiBounce, defaultEnemy, animation'); //Para la IA que lo mueve de derecha a izquierda
        },
        step: function (dt) {
            if (this.p.y > this.p.maxy) {
                this.p.vy = -70;
            }
            else if (this.p.y < this.p.miny) {
                this.p.vy = 70;
            }
        }
    });

    //Moneda
    Q.Sprite.extend("Coin", {
        init: function (p) {
            this._super(p, {
                sheet: "coin",
                x: 1000,
                y: 390,
                frame: 0
            });
            this.p.gravityY = 0;
            this.add('2d, tween'); //Para la IA que lo mueve de derecha a izquierda
            //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
            this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
                if (collision.obj.isA("Player")) {
                    this.animate({ x: this.p.x, y: this.p.y - 50, angle: 0 }, 0.25, {
                        callback: function () {
                            Q.state.inc("totalMonedas", 1);
                            Q.audio.play('coin.mp3');
                            this.destroy();
                        }
                    });


                }
            });
        }

    });

     Q.Sprite.extend("Bowser", {
        init: function (p) {
            this._super(p, {
                sheet: "bowser",
                x: 1500,
                y: 390,
                vx: 100, 
                tiempo: 0
            });
            this.add('2d, aiBounce'); //Para la IA que lo mueve de derecha a izquierda
            //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
            this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
                if (collision.obj.isA("Player")) {
                    Q.stageScene("endGame", 1, { label: "You Died" });
                    collision.obj.destroy();
                }
            });
        }
    });
    Q.component("defaultEnemy", {
        added: function(){
            //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
            this.entity.on("bump.left,bump.right,bump.bottom", function (collision) {
                if (collision.obj.isA("Player")) {
                    Q.audio.stop('music_main.mp3');
                    Q.audio.play("music_die.mp3");
                    Q.stageScene("endGame", 1, { label: "You Died" });
                    collision.obj.destroy();
                }
            });
            //Si le salta encima el player lo mata y salta más
            this.entity.on("bump.top", function (collision) {
                if (collision.obj.isA("Player")) {
                    console.log("die");
                    this.p.muerte = true;
                    this.play("die");
                    collision.obj.p.vy = -500;

                }
            });
            this.entity.on("die", function(){
                this.destroy();
            });
        }
    });
}
