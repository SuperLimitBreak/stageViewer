import * as THREE from 'three';
require('three/examples/js/controls/OrbitControls');

import Config from '../../data/three.config';


export default class Controls {
    constructor(camera, container) {
        this.threeControls = new THREE.OrbitControls( camera, container );
        for (let field of ['enableDamping', 'dampingFactor', 'enableZoom']) {
            this.threeControls[field] = Config.controls[field];
        }
    }
}
