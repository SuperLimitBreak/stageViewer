import * as THREE from 'three';
import TWEEN from 'tween.js';

import Renderer from './components/renderer';
import Camera from './components/camera';
import Controls from './components/controls';

import Config from '../data/three.config';


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor(container) {
    // Set container property to container element
    this.container = container;

    // Get Device Pixel Ratio first for retina
    if(window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this.scene, container);
    this.camera = new Camera(this.renderer.threeRenderer);
    this.controls = new Controls(this.camera.threeCamera, container);

    // Everything is now fully loaded
    Config.isLoaded = true;

    // Start render which does not wait for model fully loaded
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera.threeCamera);
    TWEEN.update();
    this.controls.threeControls.update();
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
