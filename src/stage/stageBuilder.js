const Immutable = require('immutable');
import * as THREE from 'three';

import {DEFAULT_STAGE_CONFIG} from '../data/defaultStageConfig';

const EMPTY_MAP = Immutable.Map();

function createCSS3DObject(data) {
    const get = (key1, key2, fallback=0) => data.get(key1, EMPTY_MAP).get(key2) || fallback;
    const position = (key2) => get('position', key2);
    const rotation = (key2) => get('rotation', key2);
    const display = (key2) => get('display', key2);

    const div = document.createElement('div');
    div.style = display('style') || '';
    div.style.width = `${display('width')}px`;
    div.style.height = `${display('height')}px`;
    const CSS3DObject = new THREE.CSS3DObject(div);

    let Object3D = CSS3DObject;
    if (display('pivot') == 'top') {
        CSS3DObject.position.y = -display('height')/2;
        Object3D = new THREE.Group();
        Object3D.add(CSS3DObject);
        Object3D.element = div;
    }

    Object3D.position.set(position('x'), position('y'), position('z'));
    for (let field of ['x', 'y', 'z']) {
        Object3D.rotation[field] = ((data.get('rotation', EMPTY_MAP).get(field) || 0) / 360) * 2 * Math.PI;
    }
    return Object3D;
}

export function initStage(three, screenMessageRouter, lightManager, config) {
    if (!config) {config = DEFAULT_STAGE_CONFIG;}

    // screens - displayTrigger
    for (let [screen_name, screen_data] of config.get('screens', EMPTY_MAP)) {
        const CSS3DObject = createCSS3DObject(screen_data);
        three.scene.add(CSS3DObject);
        screenMessageRouter.bindScreen(screen_name, CSS3DObject.element, Array.from(screen_data.get('subscriptions')));
    }

    // stage
    for (let [item_name, item_data] of config.get('stage', EMPTY_MAP)) {
        const CSS3DObject = createCSS3DObject(item_data);
        three.scene.add(CSS3DObject);
    }

    // lights
    for (let [light_name, light_data] of config.get('lights', EMPTY_MAP)) {
        const CSS3DObject = createCSS3DObject(light_data);
        CSS3DObject.element.id = light_name;  // Could do this for screens and stage parts too ...
        // https://github.com/mrdoob/three.js/issues/1364
        //geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 10, 0 ) );
        //geometry.applyMatrix( new THREE.Matrix4().makeTranslation( distX, distY, distZ ) );
        //geometry.translate( distX, distY, distZ ); // three.js r.72
        //mesh.geometry.translate( -myObjectWidth/2, 0, 0 );
        //CSS3DObject.translate(0, -CSS3DObject.element.height/2, 0);
        //CSS3DObject.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -CSS3DObject.element.height/2, 0 ) );

        three.scene.add(CSS3DObject);
        lightManager.bindLight(light_name, light_data, CSS3DObject);
    }

}
