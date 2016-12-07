import * as THREE from 'three';

import Config from '../../data/three.config';


export default class Controls {
    constructor(camera, container) {
        //const orbitControls = new OrbitControls(THREE);
        this.threeControls = new orbitControls(camera, container);

        this.init();
    }

    init() {
    }
}
