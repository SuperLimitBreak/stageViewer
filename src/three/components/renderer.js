import * as THREE from 'three';
require('three/examples/js/renderers/CSS3DRenderer');
//import * as CSS3DRenderer from 'three/examples/js/renderers/CSS3DRenderer';

//import Config from '../../data/three.config';


export default class Renderer {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;

        this.threeRenderer = new THREE.CSS3DRenderer();

        this.threeRenderer.domElement.style.position = 'absolute';
        this.threeRenderer.domElement.style.top = 0;
        this.threeRenderer.domElement.id = 'three';

        container.appendChild(this.threeRenderer.domElement);

        this.updateSize();

        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    render(scene, camera) {
        this.threeRenderer.render(scene, camera);
    }
}
