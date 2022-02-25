"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import LineRenderable from "../engine/renderables/line_renderable.js";
import BoundingBox from "../engine/utils/bounding_box.js";
import Lerp from "../engine/utils/lerp.js";
import Oscillate from "../engine/utils/oscillate.js";
import Head from "./patrol_components/head.js";
import Wing from "./patrol_components/wing.js";

class Patrol {
    constructor(spriteTexture, atX, atY, dir, showLines) {
        this.kDelta = 0.3;
        this.xPos = atX;
        this.yPos = atY;
        this.head = new Head(spriteTexture, atX, atY);
        this.wing_one = new Wing(spriteTexture, atX + 10, atY + 6);
        this.wing_two = new Wing(spriteTexture, atX + 10, atY - 6);
        this.dir = dir;
        this.lines = [];

        this.BBox = null
        this.updateBoundingBox();
        this.showLines = showLines;

    }

    update() {
        let dx = Math.random() / 5
        let dy = Math.random() / 5


        this.xPos += dx * this.dir[0];
        this.yPos += dy * this.dir[1];

        var top = this.BBox.maxY();
        var bottom = this.BBox.minY();
        var left = this.BBox.minX();
        var right = this.BBox.maxX();

        //find the correct bounds to use
        if(bottom <= -47.5) {
            this.dir[1] = 1
        }

        if(top >= 102.5) {
            this.dir[1] = -1
        }

        if(right >= 130) {
            this.dir[0] = -1
        }

        if(left <= -70) {
            this.dir[0] = 1
        }

        this.head.update(this.xPos, this.yPos);
        this.wing_one.update(this.xPos + 10, this.yPos + 6);
        this.wing_two.update(this.xPos + 10, this.yPos - 6);
        this.updateBoundingBox();
        if(this.showLines) {
            this.updateLines();
        }
        
        
    }
    
    hit() {
        this.xPos += 5;
        this.wing_one.incrementAlpha();
        this.wing_two.incrementAlpha();
    }

    draw(aCamera) {
        this.head.draw(aCamera);
        this.wing_one.draw(aCamera);
        this.wing_two.draw(aCamera);
        if(this.showLines) {
            this.lines.forEach(l => {
                //console.log(l);
                l.draw(aCamera);
            });
        }
    }

    shouldShowLines(val) {
        this.showLines = val;
    }

    getBBox() {
        return this.BBox;
    }
    
    updateLines() {
        var newLines = [];
        var bb = this.BBox
        newLines.push(new LineRenderable(bb.minX(), bb.minY(), bb.minX(), bb.maxY()));
        newLines.push(new LineRenderable(bb.minX(), bb.minY(), bb.maxX(), bb.minY()));
        newLines.push(new LineRenderable(bb.maxX(), bb.minY(), bb.maxX(), bb.maxY()));
        newLines.push(new LineRenderable(bb.minX(), bb.maxY(), bb.maxX(), bb.maxY()));

        newLines.forEach(l => {
            l.setColor([1.0,1.0,1.0,1.0]);
        });
        newLines = newLines.concat(this.head.getLines());
        newLines = newLines.concat(this.wing_one.getLines());
        newLines = newLines.concat(this.wing_two.getLines());
        
        this.lines = newLines;
    }

    updateBoundingBox() {
        var wing_one_pos = this.wing_one.getPos();
        var wing_size = this.wing_one.getSize();
        var wing_two_pos = this.wing_two.getPos();
        var head_pos = this.head.getPos();
        var head_size = this.head.getSize();

        var left = head_pos[0] - (head_size[0] / 2)
        var right = wing_one_pos[0] + (wing_size[0] / 2)
        var rawtop = wing_one_pos[1]+ (wing_size[1] / 2);
        var bottom = wing_two_pos[1] - (wing_size[1] / 2);
        var top = (rawtop - bottom) * 1.5 + bottom;

        var width = right - left;
        var height = top - bottom;
        var centerpos = [(left + right) / 2, (top + bottom) / 2];
        this.BBox = new BoundingBox(centerpos, width, height);
        
    }

    shouldTerminate() {
        if(this.BBox.minX() > 130) {
            return true;
        }

        if(this.wing_one.shouldTerminate()) {
            return true;
        }

        return false;
    }
}

export default Patrol;
