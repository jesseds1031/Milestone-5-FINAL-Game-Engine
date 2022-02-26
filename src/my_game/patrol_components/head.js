"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import LineRenderable from "../../engine/renderables/line_renderable.js";
import BoundingBox from "../../engine/utils/bounding_box.js";
import Oscillate from "../../engine/utils/oscillate.js";

class Head extends engine.GameObject{
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setElementPixelPositions(0, 1024, 0, 512);
        this.mRenderComponent.setElementUVCoordinate(0.1435546875, 0.2880859375, 0, 0.375)
        //this.mRenderComponent.setElementUVCoordinate(0, 0.125, 0, 0.361);
        this.mRenderComponent.setColor([.5, .6, .5, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.BBox = null;

    }

    update(targetX, targetY) {
        this.mRenderComponent.getXform().setPosition(targetX, targetY);
        this.updateBBox();
    }

    getBBox() {
        return this.BBox;
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
    
}

export default Head;
