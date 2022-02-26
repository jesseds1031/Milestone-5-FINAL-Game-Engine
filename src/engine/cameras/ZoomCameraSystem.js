import engine from "../index.js";
import ZoomCamera from "./zoom_camera.js";


class ZoomCameraSystem {
    
    constructor(initialX, initalY, width, height, padding) {
        
        this.hero_cam = new ZoomCamera(
            15,
            [initialX, initalY, width, height]);

        this.dye_cam_one = new ZoomCamera(
            6,
            [initialX + (width + padding), initalY, width, height]);

        this.dye_cam_two = new ZoomCamera(
            6,
            [initialX + (width + padding) * 2, initalY, width, height]);
            
        this.dye_cam_three = new ZoomCamera(
            6,
            [initialX + (width + padding) * 3, initalY, width, height]);
            
    }

    update() {

        if(this.hero_cam.isActive()) {
            this.hero_cam.update()
            if(this.hero_cam.getDuration() <= 0) {
                this.hero_cam.deactivate()
            }
            this.hero_cam.tick();
        }
    
        if(this.dye_cam_one.isActive()) {
            this.dye_cam_one.update()
            if(this.dye_cam_one.getDuration() <= 0) {
                this.dye_cam_one.deactivate()
            }
            this.dye_cam_one.tick();
        }
        
        if(this.dye_cam_two.isActive()) {
            this.dye_cam_two.update()
            if(this.dye_cam_two.getDuration() <= 0) {
                this.dye_cam_two.deactivate()
            }
            this.dye_cam_two.tick();
        }

        if(this.dye_cam_three.isActive()) {
            this.dye_cam_three.update()
            if(this.dye_cam_three.getDuration() <= 0) {
                this.dye_cam_three.deactivate()
            }
            this.dye_cam_three.tick();
        }
    }
    

    activateHero(target, duration) {
        if(!this.hero_cam.isActive()) {
            this.hero_cam.activate(target, duration);
        }
    }

    activateDyePack(target, duration) {
        if(!this.dye_cam_one.isActive()) {
            this.dye_cam_one.activate(target, duration)
        } else if(!this.dye_cam_two.isActive()) {
            this.dye_cam_two.activate(target, duration)
        } else if(!this.dye_cam_three.isActive()) {
            this.dye_cam_three.activate(target, duration)
        } 
    }

    activateManualDyePack(option, target, duration) {
        var options = [this.dye_cam_one, this.dye_cam_two, this.dye_cam_three];
        options[option].activate(target, duration)
    }

    getCameras() {
        return [this.hero_cam, this.dye_cam_one, this.dye_cam_two, this.dye_cam_three];
    }
}

export default ZoomCameraSystem;