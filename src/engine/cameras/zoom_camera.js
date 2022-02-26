import Camera from "./camera_main.js";

class ZoomCamera {

    constructor(width, viewportArray) {
        this.camera = new Camera(
            vec2.fromValues(0, 0),
            width,
            viewportArray
        )
        this.camera.configLerp(1, 1)
        this.active = false;
        this.target = null;
        this.duration = null
    }


    deactivate() {
        this.active = false;
    }

    isActive() {
        return this.active;
    }

    activate(target, duration) {
        this.target = target;
        this.duration = duration;
        this.active=true;
    }

    getCam() {
        return this.camera;
    }

    getDuration() {
        return this.duration
    }

    tick() {
        this.duration -= 1;
    }

    update() {
        this.camera.update()
        this.camera.setWCCenter(this.target.getPosition()[0], this.target.getPosition()[1])
    }

}

export default ZoomCamera;