var game = function () {
    //Función a la que se llamará cuando se cargue el juego
    //Objeto Quinus con los modulos que necesitamos
    var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

    //Se cargan los recursos
    Q.load("mario_small.png, mario_small.json, goomba.png, goomba.json, tiles.png", function () {
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
                    x: 410, //x donde aparecerá
                    y: 90 //y donde aparecerá
                });
                // Add in pre-made components to get up and running quickly
                // The `2d` component adds in default 2d collision detection
                // and kinetics (velocity, gravity)
                // The `platformerControls` makes the player controllable by the
                // default input actions (left, right to move, up or action to jump)
                // It also checks to make sure the player is on a horizontal surface before
                // letting them jump.
                this.add('2d, platformerControls');
                // Write event handlers to respond hook into behaviors.
                // hit.sprite is called everytime the player collides with a sprite
            }
        });
        //Sprite de Goomba
        Q.compileSheets("goomba.png", "goomba.json");
        Q.Sprite.extend("Goomba", {
            init: function(p){
                this._super(p, {
                    sheet: "goomba",
                    x: 100,
                    y: 530
                });
            }
        });
        //Se carga el nivel 1 tmx y se añaden los objetos
        Q.scene("level1", function (stage) {
            Q.stageTMX("level.tmx", stage);
            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player);
            stage.insert(new Q.Goomba());
        });
        Q.loadTMX("level.tmx", function () {
            Q.stageScene("level1");
        });
    });
}
