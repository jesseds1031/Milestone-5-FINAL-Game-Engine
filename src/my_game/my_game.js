
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import DyePack from "./dye_pack.js";
import Hero from "./hero.js";
import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import SpriteRenderable from "../engine/renderables/sprite_renderable.js";
import Patrol from "./patrol.js";
import Head from "./patrol_components/head.js";
import Wing from "./patrol_components/wing.js";
import GameObjectSet from "../engine/game_objects/game_object_set.js";
import ZoomCameraSystem from "../engine/cameras/ZoomCameraSystem.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        //assets 
        this.kDyePackSprite = "assets/dye_pack.png";
        this.kBg = "assets/bg.png";
        this.kHero = "assets/dye.png";
        this.kSpriteSheet = "assets/SpriteSheet.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mDyePacks = null;
        this.mHero = null;

        this.mHero = null;
        this.mBg = null;

        this.mMsg = null;
        
        this.mTestPatrol = null;
        this.mPatrols = null;

        this.autoSpawn = false;
        this.spawnTimer = 10000;
        this.showLines = false;

        //cameras
        this.zoomCams = null;
    
    }

    load() {
        //engine.texture.load(this.kDyePackSprite);
        engine.texture.load(this.kBg);
        //engine.texture.load(this.kHero);
        engine.texture.load(this.kSpriteSheet);
        
    }

    unload() {
        //engine.texture.unload(this.kDyePackSprite);
        engine.texture.unload(this.kBg);
        //engine.texture.unload(this.kHero);
        engine.texture.load(this.kSpriteSheet);
    }
        
    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            200,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
                // sets the background to gray

        this.mCamera.setWCCenter(100, 100)
        console.log(this.mCamera.getWCCenter())
    

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-65, -40);
        this.mMsg.setTextHeight(3); 

        this.mBg = new engine.TextureRenderable(this.kBg);
        this.mBg.getXform().setSize(400, 300);
        this.mBg.getXform().setPosition(30, 27.5);

        this.mHero = new Hero(this.kSpriteSheet, 30, 27.5);

        this.mDyePacks = new engine.GameObjectSet();

        this.mPatrols = new engine.GameObjectSet();

        this.zoomCams = new ZoomCameraSystem(0, 490, 150, 150, 10)
    }
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
        this.mCamera.setViewAndCameraMatrix();
        this.mBg.draw(this.mCamera); 
        this.mDyePacks.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mPatrols.draw(this.mCamera);

        this.mMsg.draw(this.mCamera);   // only draw status in the main camera

        var cams = this.zoomCams.getCameras();
        cams.forEach(wrapCam => {
            if(wrapCam.isActive()) {
                var cam = wrapCam.getCam()
                cam.setViewAndCameraMatrix();
                //console.log(cam.getWCCenter())
                this.mBg.draw(cam); 
                this.mDyePacks.draw(cam);
                this.mHero.draw(cam);
                this.mPatrols.draw(cam);
            }
        }); 
        //ZoomCamersSystem Loop
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        let msg = "Status: DyePacks(" + this.mDyePacks.size() + ") " + "Patrols("  + this.mPatrols.size() +  ") Autospawn(" + this.autoSpawn + ")" +
        " showLines(" + this.showLines + ")";

        // camera functionality
        this.zoomCams.update();
        if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
            this.zoomCams.activateHero(this.mHero, 120)
           
        }
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            if(this.mDyePacks.size() > 0) {
                this.zoomCams.activateManualDyePack(0, this.mDyePacks.getObjectAt(0), 120)
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.Two)) {
            if(this.mDyePacks.size() > 0) {
                this.zoomCams.activateManualDyePack(1, this.mDyePacks.getObjectAt(0), 120)
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            if(this.mDyePacks.size() > 0) {
                this.zoomCams.activateManualDyePack(2, this.mDyePacks.getObjectAt(0), 120)
            }
        }


        // Move hero
        this.mHero.update(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());

        // Get DyePack to spawn
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {

            let dyePack = new DyePack(this.kSpriteSheet, 
                this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
            
            //add to gameobject set
            this.mDyePacks.addToSet(dyePack);

        }

        //auto-spawn toggle with P
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.autoSpawn = this.autoSpawn ? false : true;
            this.spawnTimer = Math.floor(Math.random() * (240 - 140 + 1) + 140)
        }

        //manual-spawn with C
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.spawn();
        }

        //toggle bounds with B
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.showLines = this.showLines ? false : true;
            for (let i = 0; i < this.mPatrols.size(); i++) {
               const element = this.mPatrols.getObjectAt(i);   
               element.shouldShowLines(this.showLines);     
           }
        }

        //Trigger hit events with j
        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            for (let i = 0; i < this.mPatrols.size(); i++) {
               const element = this.mPatrols.getObjectAt(i);   
               element.hitHead()   
           }
        }


        for (let i = this.mPatrols.size() - 1; i >= 0; i--) {

           if(this.mPatrols.getObjectAt(i).shouldTerminate()) {
               this.mPatrols.removeFromSet(this.mPatrols.getObjectAt(i));
           } 
        }

        //autoSpawn capabilities
        if(this.autoSpawn) {
            console.log(this.spawnTimer);
            this.spawnTimer -= 1;
            if(this.spawnTimer <= 0) {
                this.spawn();
                this.spawnTimer = Math.floor(Math.random() * (240 - 140 + 1) + 140)
            }
        }

        for (let i = this.mDyePacks.size() - 1; i >= 0; i--) {
            //Delete if 
            if (this.mDyePacks.getObjectAt(i).getToDelete() 
                && !this.mDyePacks.getObjectAt(i).getIsHit()
                || this.mDyePacks.getObjectAt(i).getSpeed() <= 0) { 

                this.mDyePacks.removeFromSet(this.mDyePacks.getObjectAt(i));
            }
        }

        let h = [];
        //Test for dyepack collisions with head bounding box and head
        for (let i = 0; i < this.mDyePacks.size(); i++) {
            for(let j = 0; j < this.mPatrols.size(); j++) {

                if (this.mDyePacks.getObjectAt(i).getBBox().intersectsBound(
                    this.mPatrols.getObjectAt(j).getBBox())) {
                        //slow dyepack
                        this.mDyePacks.getObjectAt(i).slow();

                }
                // if touches head
                if (this.mDyePacks.getObjectAt(i).pixelTouches(
                    this.mPatrols.getObjectAt(j).getHead(), h)){

                        //oscillate hero size
                        this.mDyePacks.getObjectAt(i).startOscillate();
                        this.mPatrols.getObjectAt(j).hitHead();

                    } 

                    console.log((this.mDyePacks.getObjectAt(i).pixelTouches(
                        this.mPatrols.getObjectAt(j).getTopWing(), h)));
                    // or if touches wing one
                if (this.mDyePacks.getObjectAt(i).pixelTouches(
                    this.mPatrols.getObjectAt(j).getTopWing(), h)) {

                        //oscillate hero size
                        this.mDyePacks.getObjectAt(i).startOscillate();
                        this.mPatrols.getObjectAt(j).hitTopWing();
                    }
                    // or if touches wing two
                if (this.mDyePacks.getObjectAt(i).pixelTouches(
                    this.mPatrols.getObjectAt(j).getBottomWing(), h)) {

                        //oscillate hero size
                        this.mDyePacks.getObjectAt(i).startOscillate();
                        this.mPatrols.getObjectAt(j).hitBottomWing();
                }
            }
        }

        // See if hero is hitting patrol box
        for(let i = 0; i < this.mPatrols.size(); i++) {
            if (this.mHero.getBBox().intersectsBound(this.mPatrols.getObjectAt(i).getBBox())) {
                    //slow dyepack
                    this.mHero.startOscillate();

            }

        }

        this.mDyePacks.update();
        this.mPatrols.update();


        this.mMsg.setText(msg);
    }

    spawn() {
        let randPosX = Math.random() * (130 * .75 - 30) + 30;
        let randPosY = Math.random() * (76.875 - (-47.5 * .75)) + (-47.5 * .75);
        let randXDir = Math.random() < 0.5 ? 1 : -1;
        let randYDir = Math.random() < 0.5 ? 1 : -1;
        this.mPatrols.addToSet(new Patrol(this.kSpriteSheet, randPosX, randPosY, [randXDir, randYDir], this.showLines));

    }

}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
