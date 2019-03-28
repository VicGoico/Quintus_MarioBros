var game = function () {
    //Función a la que se llamará cuando se cargue el juego
    //Objeto Quinus con los modulos que necesitamos
    var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
        // Maximize this game to whatever the size of the browser is
        .setup({ 
            maximize: true,
            width: 320, // Set the default width to 320 pixels
            height: 480, // Set the default height to 480 pixels
            upsampleWidth: 420, // Double the pixel density of the
            upsampleHeight: 320, // game if the w or h is 420x320
            // or smaller (useful for retina phones)
            downsampleWidth: 1024, // Halve the pixel density if resolution
            downsampleHeight: 768 // is larger than or equal to 1024x768 
        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()
    //Se cargan los recursos
    Q.load("mario_small.png, mario_small.json, goomba.png, goomba.json,bloopa.png, bloopa.json, princess.png, princess.json, tiles.png", function () {
        Q.sheet("tiles", "tiles.png", {
            tilew: 32,
            tileh: 32
        });

        //Sprite de Mario
        Q.compileSheets("mario_small.png", "mario_small.json");
        Q.Sprite.extend("Player", {
            // the init constructor is called on creation
            init: function (p) {
                // You can call the parent's constructor with this._super(..)
                this._super(p, {
                    sheet: "marioR", // Sprite que esta dentro de mario_small.json
                    x: 300, //x donde aparecerá
                    jumpSpeed: -400,
                    y: 500 //y donde aparecerá
                });
                // Add in pre-made components to get up and running quickly
                // The `2d` component adds in default 2d collision detection
                // and kinetics (velocity, gravity)
                // The `platformerControls` makes the player controllable by the
                // default input actions (left, right to move, up or action to jump)
                // It also checks to make sure the player is on a horizontal surface before
                // letting them jump.
                this.add('2d, platformerControls, tween');
                //this.on("bump.bottom",this,"stomp");
                // Write event handlers to respond hook into behaviors.
                // hit.sprite is called everytime the player collides with a sprite
            },
            step: function (dt) {
                if(this.p.y > 700){
                    Q.stageScene("endGame", 1, { label: "You Died" });
                    console.log("cayendo");
                    this.p.x = 300;
                    this.p.y = 500;
                }
                //Futura animacion de mario
                /*
                if (this.p.vx > 0) {
                    this.play("run_right");
                } else if (this.p.vx < 0) {
                    this.play("run_left");
                } else {
                    this.play("stand_" + this.p.direction);
                }*/

            }
            

        });
        //Sprite de Goomba
        Q.compileSheets("goomba.png", "goomba.json");
        Q.Sprite.extend("Goomba", {
            init: function (p) {
                this._super(p, {
                    sheet: "goomba",
                    x: 500,
                    y: 530,
                    vx: 100
                });
                this.add('2d, aiBounce'); //Para la IA que lo mueve de derecha a izquierda
                //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
                this.on("bump.left,bump.right,bump.bottom", function (collision) {
                    if (collision.obj.isA("Player")) {
                        Q.stageScene("endGame", 1, { label: "You Died" });
                        collision.obj.destroy();
                    }
                });
                //Si le salta encima el player lo mata y salta más
                this.on("bump.top", function (collision) {
                    if (collision.obj.isA("Player")) {
                        this.destroy();
                        collision.obj.p.vy = -300;
                    }
                });
            }
        });

        //
        Q.compileSheets("bloopa.png", "bloopa.json");
        Q.Sprite.extend("Bloopa", {
            init: function (p) {
                this._super(p, {
                    sheet: "bloopa",
                    x: 600,
                    y: 400,
                    vx: 30,
                    frame: 0
                });
                this.add('2d, aiBounce'); //Para la IA que lo mueve de derecha a izquierda
                //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
                this.on("bump.left,bump.right,bump.bottom", function (collision) {
                    if (collision.obj.isA("Player")) {
                        Q.stageScene("endGame", 1, { label: "You Died" });
                        collision.obj.destroy();
                    }
                });
                //Si le salta encima el player lo mata y salta más
                this.on("bump.top", function (collision) {
                    if (collision.obj.isA("Player")) {
                        this.destroy();
                        // -300
                        collision.obj.p.vy = -300;
                    }
                });
            }
        });

        Q.compileSheets("princess.png", "princess.json");
        Q.Sprite.extend("Princess", {
            init: function (p) {
                this._super(p, {
                    sheet: "princess",
                    x: 600,
                    y: 400,
                    vx: 30,
                    frame: 0
                });
                this.add('2d, aiBounce'); //Para la IA que lo mueve de derecha a izquierda
                //Si le tocan por la izquierda, derecha o por debajo y es el player, pierde
                this.on("bump.left,bump.right,bump.bottom", function (collision) {
                    if (collision.obj.isA("Player")) {
                        Q.stageScene("endGame", 1, { label: "You Died" });
                        collision.obj.destroy();
                    }
                });
                //Si le salta encima el player lo mata y salta más
                this.on("bump.top", function (collision) {
                    if (collision.obj.isA("Player")) {
                        this.destroy();
                        // -300
                        collision.obj.p.vy = -300;
                    }
                });
            }
        });
        Q.scene("ventanaPrincipal", function(stage){
            Q.stageScene("mainTitle.png",stage);
        });
        //Se carga el nivel 1 tmx y se añaden los objetos
        Q.scene("level1", function (stage) {
            Q.stageTMX("level.tmx", stage);
            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player);
          	stage.viewport.scale = 1.5;
           // stage.insert(new Q.Bloopa());

           // stage.insert(new Q.Goomba());
            stage.insert(new Q.Princess());
           // stage.insert(new Q.Goomba({x: 800}));
        });
        Q.loadTMX("level.tmx", function () {
            Q.stageScene("level1");
        });
        Q.scene('endGame',function(stage) {
            var box = stage.insert(new Q.UI.Container({
              x: Q.width/2, y: Q.height/2, fill: "rgba(1,0,0,0.5)"
            }));
            
            var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                     label: "Play Again" }))         
            var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                  label: stage.options.label }));
            button.on("click",function() {
              Q.clearStages();
              Q.stageScene('level1');
            });
            box.fit(20);
          });
    });
}
