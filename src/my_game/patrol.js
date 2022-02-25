"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Lerp from "../engine/utils/lerp.js";
import Oscillate from "../engine/utils/oscillate.js";
import Head from "./patrol_components/head.js";
import Wing from "./patrol_components/wing.js";

class Patrol {
    constructor(spriteTexture, atX, atY) {
        this.kDelta = 0.3;
        this.xPos = atX;
        this.yPos = atY;
        this.head = new Head(spriteTexture, atX, atY);
        this.wing_one = new Wing(spriteTexture, atX + 10, atY + 6);
        this.wing_two = new Wing(spriteTexture, atX + 10, atY - 6);
        this.dir = [1, 1];

    }

    update() {
        let dx = Math.random() / 10
        let dy = Math.random() / 10


        this.xPos += dx * this.dir[0];
        this.yPos += dy * this.dir[1];


        //find the correct bounds to use
        if(this.yPos >= 40 || this.yPos <= -60) {
            this.dir[1] *= -1
            this.yPos += 1 * this.dir[1];
        }

        if(this.xPos >= 80 || this.xPos <= -60) {
            this.dir[0] *= -1
            this.xPos += 1 * this.dir[0];
        }

        this.head.update(this.xPos, this.yPos);
        this.wing_one.update(this.xPos + 10, this.yPos + 6);
        this.wing_two.update(this.xPos + 10, this.yPos - 6);
    }
    
    draw(aCamera) {
        this.head.draw(aCamera);
        this.wing_one.draw(aCamera);
        this.wing_two.draw(aCamera);
    }
}

export default Patrol;
