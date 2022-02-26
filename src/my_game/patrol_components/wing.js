"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import LineRenderable from "../../engine/renderables/line_renderable.js";
import BoundingBox from "../../engine/utils/bounding_box.js";
import Lerp from "../../engine/utils/lerp.js";
import Oscillate from "../../engine/utils/oscillate.js";

class Wing extends engine.GameObject{
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.3;
        
        this.mRenderComponent = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(10, 8);
        this.mRenderComponent.setSpriteSequence(348, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mRenderComponent.setAnimationSpeed(10);
        this.mRenderComponent.setAnimationType(engine.eAnimationType.eRight);

        this.BBox = null

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
        this.updateBBox();
        /*
        if(this.mRenderComponent.getColor()[3] > 0.005) {
            this.decrementAlpha();
        }
        */
    }

    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }

    updateBBox() {
        var xform = this.mRenderComponent.getXform()
        this.BBox = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    }

    getLines() {
        var newLines = [];
        var bb = this.BBox
        newLines.push(new LineRenderable(bb.minX(), bb.minY(), bb.minX(), bb.maxY()));
        newLines.push(new LineRenderable(bb.minX(), bb.minY(), bb.maxX(), bb.minY()));
        newLines.push(new LineRenderable(bb.maxX(), bb.minY(), bb.maxX(), bb.maxY()));
        newLines.push(new LineRenderable(bb.minX(), bb.maxY(), bb.maxX(), bb.maxY()));

        newLines.forEach(l => {
            l.setColor([1.0,1.0,1.0,1.0]);
        });
        return newLines;
    }
    getPos() {
        return this.mRenderComponent.getXform().getPosition();
    }
 
    getSize() {
        return this.mRenderComponent.getXform().getSize();
    }

    incrementAlpha() {
        this.mRenderComponent.mColor[3] += 0.2;
    }

    decrementAlpha() {
        this.mRenderComponent.mColor[3] -= 0.005;
    }

    shouldTerminate() {
        return this.mRenderComponent.mColor[3] >= 1.0;
    }

}

export default Wing;
