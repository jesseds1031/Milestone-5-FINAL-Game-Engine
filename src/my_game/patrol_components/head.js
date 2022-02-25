"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Oscillate from "../../engine/utils/oscillate.js";

class Head{
    constructor(spriteTexture, atX, atY) {
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 1024, 0, 512);
        this.mRenderComponent.setElementUVCoordinate(0.1435546875, 0.2880859375, 0, 0.375)
        //this.mRenderComponent.setElementUVCoordinate(0, 0.125, 0, 0.361);
        this.mRenderComponent.setColor([.5, .6, .5, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(7.5, 9);


    }

    update(targetX, targetY) {
        this.mRenderComponent.getXform().setPosition(targetX, targetY);
    }

    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }

    
}

export default Head;
