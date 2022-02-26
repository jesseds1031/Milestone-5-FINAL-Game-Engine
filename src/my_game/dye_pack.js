"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Oscillate from "../engine/utils/oscillate.js";
import BoundingBox from "../engine/utils/bounding_box.js";

class DyePack extends engine.GameObject{
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 1024, 0, 512);
        this.mRenderComponent.setElementUVCoordinate(0.48828125, 0.5849609375, 0, 0.30078125)
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

        this.mIsHit = false;
    }

    getPosition() {
        return this.mRenderComponent.getXform().getPosition();
    }

    getBBox() {
        return new BoundingBox(
            this.mRenderComponent.getXform().getPosition(), 
            this.mRenderComponent.getXform().getWidth(),
            this.mRenderComponent.getXform().getHeight()
        );
    }

    startOscillate() {
        if (!this.mIsHit) {
            this.mOscillate.reStart();
            this.mIsHit = true;
        }
    }

    getIsHit() {
        return this.mIsHit;
    }

    getSpeed() {
        return this.mDeltaX;
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
            this.slow()
        }

        if (engine.input.isKeyClicked(engine.input.keys.S)) {
            this.startOscillate();
        }

        if (this.mIsHit) {
            let x = this.mOscillate.getNext();
            this.mRenderComponent.getXform().incXPosBy(x);

            if (this.mOscillate.done()) {
                this.mIsHit = false; 
            }
        }

    }

    slow() {
        this.mDeltaX -= 0.1;
    }

    getToDelete() {
        return this.mToDelete;
    }
    
}

export default DyePack;
