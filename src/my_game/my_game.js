"use strict";  // Operate in Strict mode such that variables must be declared before used!

import DyePack from "./dye_pack.js";
import Hero from "./hero.js";
import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        //assets 
        this.kDyePackSprite = "assets/f_walk.png";
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mDyePacks = null;

        this.mHero = null;
        this.mBg = null;

        this.mMsg = null;
    
    }

    load() {
        engine.texture.load(this.kDyePackSprite);
        engine.texture.load(this.kBg);
        
    }

    unload() {
        engine.texture.unload(this.kDyePackSprite);
        engine.texture.unload(this.kBg);
    }
        
    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
                // sets the background to gray
    

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-65, -40);
        this.mMsg.setTextHeight(3); 

        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(400, 400);
        this.mBg.getXform().setPosition(50, 40);

        this.mDyePacks = new engine.GameObjectSet()
    }
    
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera); 
        this.mDyePacks.draw(this.mCamera);
        
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        let msg = "Status: DyePacks(" + this.mDyePacks.size() + ") " + "Patrols() Autospawn()";
  
        // Get DyePack to spawn
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {

            let dyePack = new DyePack(this.kDyePackSprite, 
                this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
            
            //add to gameobject set
            this.mDyePacks.addToSet(dyePack);

            console.log(this.mDyePacks);
        }

        if (this.mDyePacks.size() > 0) {
            // if DyePack should be deleted
            if (this.mDyePacks.getObjectAt(0).getToDelete()) { 
                this.mDyePacks.removeFirstFromSet();
            }
        }

        this.mDyePacks.update();
        this.mMsg.setText(msg);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
