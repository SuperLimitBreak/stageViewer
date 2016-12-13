const Immutable = require('immutable');
import * as THREE from 'three';

import {DEFAULT_STAGE_CONFIG} from '../data/defaultStageConfig';

const EMPTY_MAP = Immutable.Map();

function createCSS3DObject(data) {
    const div = document.createElement('div');
    div.style = data.get('style', '');
    const CSS3DObject = new THREE.CSS3DObject(div);
    for (let field of ['x', 'y', 'z']) {
        CSS3DObject.position[field] = data.get('position', EMPTY_MAP).get(field) || 0;
    }
    for (let field of ['x', 'y', 'z']) {
        CSS3DObject.rotation[field] = ((data.get('rotation', EMPTY_MAP).get(field) || 0) / 360) * 2 * Math.PI;
    }
    return CSS3DObject;
}

export function initStage(three, screenMessageRouter, lightManager, config) {
    if (!config) {config = DEFAULT_STAGE_CONFIG;}

    // displayTrigger
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

}
