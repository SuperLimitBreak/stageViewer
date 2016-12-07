import * as THREE from 'three';
import TWEEN from 'tween.js';

import Renderer from './components/renderer';
import Camera from './components/camera';
import Controls from './components/controls';

import Config from '../data/three.config';


export default class ThreeMain {
    constructor(container) {
        this.container = container;

        if(window.devicePixelRatio) {
            Config.dpr = window.devicePixelRatio;
        }

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.renderer = new Renderer(this.scene, container);
        this.camera = new Camera(this.renderer.threeRenderer);
        this.controls = new Controls(this.camera.threeCamera, container);

        Config.isLoaded = true;

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera.threeCamera);
        TWEEN.update();
        this.controls.threeControls.update();
        requestAnimationFrame(this.render.bind(this));
    }
}
