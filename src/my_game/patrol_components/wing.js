"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Lerp from "../../engine/utils/lerp.js";
import Oscillate from "../../engine/utils/oscillate.js";

class Wing{
    constructor(spriteTexture, atX, atY) {
        this.kDelta = 0.3;
        
        this.mRenderComponent = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mRenderComponent.setColor([.5, .6, .5, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(10, 8);
        this.mRenderComponent.setSpriteSequence(348, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mRenderComponent.setAnimationSpeed(10);
        this.mRenderComponent.setAnimationType(engine.eAnimationType.eRight);

        this.mXPos = new Lerp(atX, 120, 0.05);
        this.mYPos = new Lerp(atY, 120, 0.05);


    }

    update(targetX, targetY) {
        this.mRenderComponent.updateAnimation();
        this.mXPos.setFinal(targetX);
        this.mYPos.setFinal(targetY);

        let xform = this.mRenderComponent.getXform();
        
        // lerp updates
        this.mXPos.update();
        this.mYPos.update(); 

        xform.setPosition(this.mXPos.get(), this.mYPos.get());
    }

    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }

    
}

export default Wing;
