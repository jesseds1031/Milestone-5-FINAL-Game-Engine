"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Oscillate from "../engine/utils/oscillate.js";

class DyePack extends engine.GameObject{
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
        this.mRenderComponent.setColor([.5, .6, .5, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(2, 3.25);
        this.mRenderComponent.getXform().setRotationInDegree(90);
        this.mToDelete = false;

        //timer 
        let currentTime = performance.now();
        this.mCreationTime = currentTime;
        this.mTimePassed = 0;

        //move forward at rate of 10 units per sec
        this.mDeltaX = 2.0 // 60 updates per second, 60 * 2 = 120 units

        // Hit events
        this.mOscillate = new Oscillate(4, 20, 300); 
        this.mYOscillate = new Oscillate(.2, 20, 300);  
    
        this.mIsHit = false;
    }

    update() {
        let currentTime = performance.now();
        this.mTimePassed = currentTime - this.mCreationTime;

        let xform = this.mRenderComponent.getXform();

        // move dyepack continuously
        xform.incXPosBy(this.mDeltaX)

        //delete function
        if (this.mTimePassed > 5000.0 || this.mDeltaX <= 0) {
            this.mToDelete = true;  
        }

        //delete function
        if (this.mRenderComponent.getXform().getXPos() < -70 || 
            this.mRenderComponent.getXform().getXPos() > 130) {
            this.mToDelete = true;
        }

        // slow function
        if (engine.input.isKeyPressed(engine.input.keys.D)) { // or collision w/ patrol
            this.mDeltaX -= 0.1;
        }

        if (engine.input.isKeyClicked(engine.input.keys.S)) {
            this.mOscillate.reStart();
            this.mYOscillate.reStart();
            this.mIsHit = true;
        }

        if (this.mIsHit) {
            let x = this.mOscillate.getNext();
            let y = this.mYOscillate.getNext();
            this.mRenderComponent.getXform().incXPosBy(x);
            this.mRenderComponent.getXform().incYPosBy(y);

            if (this.mOscillate.done()) {
                this.mIsHit = false; 
            }
        }

    }

    getToDelete() {
        return this.mToDelete;
    }
    
}

export default DyePack;
